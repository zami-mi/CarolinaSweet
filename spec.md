# ESPECIFICACIÓN FUNCIONAL Y TÉCNICA DEL SISTEMA (SPEC) — CAROLINA SWEET

## 1. Alcance y Propósito del Proyecto
**Carolina Sweet** es una aplicación web centralizada, mobile-first y artesanal diseñada para la gestión operativa integral de la pastelería artesanal de Carolina. Resuelve de forma definitiva la dispersión de información (actualmente en WhatsApp y cuadernos físicos), unificando pedidos, seguimiento visual mediante Kanban, catálogo de productos, agenda de clientes, historial de ventas y reportes periódicos.

- **Diseño visual:** Mobile-first, interfaz limpia y acogedora basada en la paleta artesanal (#FFF9F4, #F8E8E5, #B66C70, #79534A).
- **Acceso inicial:** Modo taller abierto (datos locales con semillas), con arquitectura y base de datos preparadas para incorporar autenticación futura con roles (`admin`, `employee`).

---

## 2. Requisitos del Sistema

### 2.1 Requisitos Funcionales (RF)
- **1:** Carga ágil de pedidos para clientes habituales (de agenda) u ocasionales (nombre y teléfono en el acto).
- **2:** Congelamiento histórico del precio unitario de cada producto al momento de confirmar el pedido.
- **3:** Soporte para adicionales personalizados con concepto en texto libre y monto numérico.
- **4:** Cálculo automático de Subtotal, Total, Seña y Saldo restante ($\text{Total} - \text{Seña}$).
- **5:** Tablero Kanban con 4 columnas de estado (`Pendiente`, `En preparación`, `Listo`, `Entregado`).
- **6:** Selector desplegable táctil (`<select>`) en cada tarjeta para transiciones ergonómicas en móviles.
- **7:** Estampado automático de `delivered_at` al entregar y modal de confirmación si se reabre.
- **8:** Edición de productos, cantidades y fechas permitida exclusivamente en estado `Pendiente`.
- **9:** Catálogo de productos con categorías, precios, alérgenos y conmutador táctil de disponibilidad.
- **10:** Agenda de clientes con notas de preferencias estéticas y seguimiento estricto de alergias.
- **11:** Vinculación automática de compras anteriores de ocasionales al crear un habitual con ese teléfono (**HU-02**).
- **12:** Preservación de historial mediante desactivación lógica (*soft-delete*) en clientes y productos.
- **13:** Dashboard con recordatorios de entrega dinámicos agrupados en *Hoy*, *Mañana* y *Próximos 3 días*.
- **14:** Módulo de reportes con filtros por Día, Semana, Mes y Año con ranking de los 5 productos más vendidos.

### 2.2 Requisitos No Funcionales (RNF)
- **R-Rendimiento:** Respuestas de API en menos de 200 ms; tiempos de carga de la SPA en menos de 1 segundo.
- **-Ergonomía Mobile-First:** Elementos interactivos con área táctil mínima de 44x44 px adaptados al trabajo en cocina.
- **-Portabilidad:** Ejecución en Node.js 24 mediante `node:sqlite` nativo sin compiladores binarios C++.
- **-Seguridad y RBAC:** Sanitización de datos, validaciones de negocio en backend y middleware modular de roles.
- **-Confiabilidad:** Claves foráneas activas, modo WAL y cobertura de pruebas automatizadas del 100%.

---

## 3. Reglas de Negocio (RN)

- **- (Identificador de Cliente):** El número de teléfono actúa como identificador principal único. No pueden existir dos clientes habituales con el mismo teléfono.
- **- (Vinculación Automática HU-02):** Al registrar a un nuevo cliente habitual, el sistema busca y asocia de inmediato todos los pedidos anteriores registrados como ocasionales con ese teléfono.
- **- (Baja Lógica / Soft-Delete):** Los clientes y productos con pedidos históricos no se eliminan físicamente; se desactivan (`is_active = 0` / `is_available = 0`) para preservar los registros contables.
- **- (Congelamiento de Precios):** El precio de venta queda grabado de forma inmutable en `order_items.unit_price`. Los aumentos de precio en el catálogo no alteran pedidos pasados o pendientes.
- **- (Disponibilidad en Nuevos Pedidos):** Solo los productos con `is_available = 1` pueden ser seleccionados en nuevos pedidos.
- **- (Límites de Seña y Saldos):** La seña abonada no puede superar el monto total del pedido ($0 \le \text{Seña} \le \text{Total}$).
- **- (Validación de Fecha de Entrega):** La fecha comprometida debe ser igual o posterior a la fecha actual ($\text{delivery\_date} \ge \text{today}$).
- **- (Inmutabilidad por Estado):** Solo se pueden modificar los ítems, adicionales y fechas de un pedido si está en estado `Pendiente`.
- **- (Estampado y Reapertura):** Al pasar a `Entregado` se estampa `delivered_at`. Revertir a un estado previo requiere confirmación explícita y limpia dicha marca.
- **- (Depuración de Cancelados):** Los pedidos cancelados pueden depurarse únicamente tras superar los 365 días desde su cancelación.

---

## 4. Historias de Usuario (HU) y Criterios de Aceptación (CA)

### HU-01: Carga Rápida de Pedidos Ocasionales
- **Dado** que Carolina recibe un encargo por WhatsApp,
- **Cuando** ingresa nombre, teléfono, selecciona al menos 1 producto disponible, fija fecha válida e ingresa seña opcional,
- **Entonces** el sistema guarda el pedido en estado `Pendiente`, calcula el saldo restante y lo ubica en el Kanban sin requerir ficha previa.

### HU-02: Registro de Cliente Habitual y Vinculación de Historial
- **Dado** que un cliente frecuente solicita recordar sus restricciones alimentarias,
- **Cuando** Carolina registra al cliente con su número de teléfono en la agenda,
- **Entonces** el sistema crea la ficha habitual y asocia automáticamente todos los pedidos históricos que compartan ese teléfono.

### HU-03: Seguimiento y Cambio de Estado en Kanban
- **Dado** que una torta terminó de hornearse y decorarse,
- **Cuando** Carolina selecciona en el menú desplegable de la tarjeta la opción `"Listo"`,
- **Entonces** la tarjeta se mueve de columna en tiempo real y los contadores del panel se recalculan.

### HU-04: Protección de Pedidos en Curso
- **Dado** que un pedido está en `En preparación`, `Listo` o `Entregado`,
- **Cuando** se intenta enviar una solicitud de edición de ítems o fechas,
- **Entonces** el sistema rechaza la petición con error `400` (*"Solo se pueden editar pedidos en estado Pendiente"*).

### HU-05: Reportes Periódicos de Ventas
- **Dado** que Carolina desea conocer su facturación del mes,
- **Cuando** selecciona el filtro `"Mes"` en el módulo de reportes,
- **Entonces** el sistema suma únicamente los importes de pedidos con estado `Entregado` cuya fecha corresponda al mes en curso.

---

## 5. Casos Alternativos y Excepcionales

| Caso Excepcional | Comportamiento del Sistema |
|---|---|
| **Teléfono repetido al crear cliente** | Bloqueo con error `400`: *"Ya existe un cliente habitual registrado con este número"*. |
| **Fecha de entrega en el pasado** | Bloqueo con error `400`: *"La fecha de entrega debe ser hoy o una fecha posterior"*. |
| **Seña mayor al total del pedido** | Bloqueo con error `400`: *"La seña no puede superar el monto total del pedido"*. |
| **Eliminar producto con pedidos históricos** | Se intercepta la eliminación física y se conmuta a pausado (`is_available = 0`). |
| **Reapertura de pedido Entregado** | Diálogo modal interactivo de confirmación antes de permitir el retroceso a `En preparación`. |
| **Reinicio de contenedor efímero** | La base de datos SQLite se auto-inicializa con semillas predeterminadas listas para usar. |

---

*Estado de la especificación: Cerrada, aprobada y verificada al 100% mediante 44 pruebas automatizadas.*
