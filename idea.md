# Idea de Proyecto: Carolina Sweet

## 1. Descripción Inicial
**Carolina Sweet** es un emprendimiento de pastelería artesanal liderado por Carolina, enfocado en tortas personalizadas, mesas dulces, cupcakes temáticos, desayunos especiales y bocados de alta repostería para celebraciones familiares y eventos. La propuesta se distingue por la calidez en el trato, el detalle visual y el sabor casero y artesanal.

---

## 2. El Problema
En el día a día del taller de repostería, la gestión se realiza de forma manual y dispersa:
- **Dispersión de canales:** Los pedidos ingresan principalmente por WhatsApp, mensajes directos de Instagram o encargos presenciales.
- **Anotaciones en cuadernos o pizarras:** Riesgo constante de perder pedidos, traspapelar comprobantes o no registrar modificaciones solicitadas por el cliente a último momento.
- **Riesgo en alergias alimentarias:** No contar con un registro sistemático de clientas habituales con intolerancias o alergias (ej. celiaquía, frutos secos, lactosa) expone al negocio a incidentes graves.
- **Falta de visibilidad de estados en cocina:** Dificultad para saber con certeza qué tortas están en horno, cuáles requieren enfriamiento, cuáles están listas para entrega y cuáles ya fueron retiradas.
- **Fricción financiera:** Pérdida de control sobre señas abonadas vs. saldos pendientes al momento de la entrega, además de la falta de métricas sobre cuánto se factura por semana o por mes.

---

## 3. Objetivo General
Desarrollar una aplicación web centralizada, responsiva y orientada a dispositivos móviles (*mobile-first*) con una estética cálida y artesanal, que permita a Carolina gestionar de manera ágil e integrada sus pedidos, catálogo, clientes, recordatorios y reportes de ventas.

---

## 4. Propuesta de Solución
Una plataforma digital accesible desde el celular en el taller o desde la computadora:
1. **Registro ágil de pedidos:** En pocos toques se carga el cliente, productos, adicionales, fechas, seña y saldo calculado automáticamente.
2. **Tablero Kanban táctil:** Columnas de estado (*Pendiente, En preparación, Listo, Entregado*) con controles desplegables táctiles ergonómicos, evitando deslices accidentales al manipular el teléfono con las manos en el taller.
3. **Agenda de clientes habituales con alérgenos:** Fichas con notas de preferencias estéticas y advertencias de salud visibles, vinculando automáticamente compras anteriores (**HU-02**).
4. **Catálogo con control de disponibilidad:** Activación o pausado inmediato de creaciones sin romper el historial contable de ventas pasadas.
5. **Dashboard con recordatorios automáticos:** Alertas ordenadas para entregas de *Hoy*, *Mañana* y *Próximos 3 días*.
6. **Módulo de reportes periódicos:** Consulta en tiempo real de facturación y ranking de los productos más vendidos.

---

## 5. Alcance Inicial
### Incluido en la versión actual:
- Gestión completa de pedidos (alta, edición en pendiente, duplicación, favoritos, cálculo de saldos).
- Flujo Kanban de 4 estados con confirmación de reapertura.
- Catálogo de productos y categorías con soft-delete de protección.
- Agenda de clientes (habituales y ocasionales) con vinculación histórica por teléfono.
- Panel de recordatorios dinámicos y métricas de ventas por día, semana, mes y año.
- Base de datos relacional SQLite local con soporte para auto-recuperación en despliegues efímeros.
- Arquitectura preparada para roles y autenticación futura (RBAC).

### Excluido en la versión inicial:
- Control de stock o inventario de ingredientes (harina, huevos, manteca).
- Pasarela de cobros en línea con tarjetas de crédito automatizadas.
- Portal público de compras para clientes finales (la aplicación es un panel interno de gestión para Carolina).
