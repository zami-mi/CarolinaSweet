# Requisitos Funcionales: Carolina Sweet

Los requisitos funcionales detallan las capacidades y comportamientos que el sistema debe proveer organizados por módulos:

---

## 1: Módulo de Pedidos
- **- Creación de pedidos:** El sistema debe permitir registrar pedidos tanto para clientes habituales (seleccionados de la agenda) como para clientes ocasionales (ingresando nombre y teléfono de contacto).
- **- Selección de ítems y congelamiento:** El usuario podrá agregar uno o más productos del catálogo con cantidad. El sistema congelará el precio unitario vigente al momento de guardar.
- **- Conceptos adicionales:** El sistema debe permitir agregar un concepto adicional personalizado en texto libre y su monto correspondiente (ej. *Topper personalizado: +$2.500*).
- **- Cálculo automático:** El sistema debe calcular automáticamente:
  $$\text{Subtotal} = \sum (\text{cantidad} \times \text{precio unitario})$$
  $$\text{Total} = \text{Subtotal} + \text{Adicionales}$$
  $$\text{Saldo Pendiente} = \text{Total} - \text{Seña/Anticipo}$$
- **- Validación de seña:** El monto de la seña no podrá superar el total del pedido.
- **-Validación de fecha:** La fecha de entrega no puede ser anterior a la fecha actual del sistema.
- **-Restricción de edición:** La modificación de productos, fechas y montos solo está habilitada cuando el pedido se encuentra en estado `Pendiente`.
- **- Duplicación:** Debe permitir duplicar un pedido existente creando uno nuevo en estado `Pendiente` con fecha seleccionada.
- **- Favoritos:** Debe permitir conmutar una marca de "Favorito" para destacar pedidos frecuentes.

---

## 2: Módulo de Tablero Kanban y Estados
- **- Columnas de estado:** El tablero debe organizar los pedidos en 4 columnas: `Pendiente`, `En preparación`, `Listo` y `Entregado`.
- **- Selector ergonómico:** La transición de estados se realiza mediante un control `<select>` táctil en cada tarjeta para evitar desplazamientos accidentales en pantallas táctiles.
- **- Marca de entrega:** Al pasar a estado `Entregado`, el sistema debe estampar la marca temporal `delivered_at`.
- **- Reapertura de pedidos:** Si se cambia de `Entregado` a otro estado, el sistema debe solicitar confirmación previa y limpiar la marca `delivered_at`.
- **- Depuración de cancelados:** El sistema debe proveer una acción de limpieza para pedidos cancelados con antigüedad mayor a 365 días.

---

## 3: Módulo de Catálogo de Productos
- **- CRUD de productos:** Crear, listar, editar y cambiar disponibilidad de productos.
- **- Categorización:** Clasificar los productos en categorías (Tortas artesanales, Cupcakes, Cheesecakes, Boxes).
- **- Alérgenos y notas:** Registro de alérgenos por producto (Gluten, Lácteos, Frutos secos, etc.).
- **- Pausado de disponibilidad:** Conmutar entre `Disponible` (1) y `Pausado` (0). Los productos pausados no pueden ser seleccionados en nuevos pedidos.
- **- Protección de integridad:** Si un producto tiene pedidos históricos asociados, no se eliminará de la base de datos; en su lugar, se pausará automáticamente para preservar el historial.

---

## 4: Módulo de Clientes (Agenda)
- **- Clientes habituales:** Registro de nombre, teléfono (único), notas sobre preferencias y alergias alimentarias.
- **- Vinculación automática (HU-02):** Al crear un cliente habitual, el sistema debe buscar pedidos anteriores registrados como ocasionales con ese mismo número de teléfono y vincularlos a su nueva ficha.
- **- Baja lógica (*Soft delete*):** Los clientes pueden desactivarse para no seleccionarlos en nuevos pedidos, conservando sus pedidos anteriores intactos.
- **- Historial del cliente:** Visualizar todos los pedidos pasados de un cliente desde su ficha de detalle.

---

## 5: Módulo de Dashboard y Recordatorios
- **- Métricas resumen:** Mostrar facturación mensual de entregados, cantidad de pedidos pendientes y próximas entregas.
- **- Recordatorios clasificados:** Clasificación automática de pedidos en:
  - *Hoy*
  - *Mañana*
  - *Próximos 3 días*
- **- Actualización en tiempo real:** Los recordatorios se basan exclusivamente en el estado activo del pedido; al cambiar de estado se actualizan sin requerir descartes manuales.

---

## 6: Módulo de Reportes
- **- Períodos:** Filtrar ventas por `Hoy` (*day*), `Esta Semana` (*week*), `Este Mes` (*month*) y `Este Año` (*year*).
- **- Facturación y ticket promedio:** Suma de montos totales y cálculo del promedio exclusivamente de pedidos con estado `Entregado`.
- **- Ranking de productos:** Top 5 productos con mayor cantidad de unidades vendidas y montos recaudados.
- **- Distribución por estado:** Conteo total de pedidos por cada estado en el período seleccionado.
