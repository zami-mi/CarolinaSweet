# Descripción del Proyecto: Carolina Sweet

## 1. Identificación del Proyecto
- **Nombre:** Carolina Sweet — Sistema de Gestión para Pastelería Artesanal
- **Tipo de Aplicación:** Aplicación Web Integral Mobile-First (SPA + API REST + Base de Datos SQLite)
- **Destinataria:** Carolina, propietaria y pastelera artesanal de Carolina Sweet.
- **Año:** 2026

---

## 2. Problema Detectado
Actualmente, la gestión operativa de la pastelería presenta dispersión de información y fricción diaria:
1. **Dispersión de canales:** Los pedidos ingresan por WhatsApp, llamadas o de manera presencial, anotándose en cuadernos físicos o notas sueltas.
2. **Pérdida de trazabilidad:** Dificultad para saber en qué etapa se encuentra cada pedido (*¿ya se horneó? ¿está listo para retiro?*).
3. **Falta de historial de clientes:** Olvido recurrente de las alergias alimentarias (ej. celiaquía, frutos secos) o gustos específicos de clientas frecuentes.
4. **Falta de visibilidad financiera:** Complejidad para calcular saldos pendientes de entrega (monto total vs. seña abonada) y facturación acumulada mensual.

---

## 3. Solución Propuesta
Una solución digital personalizada, diseñada bajo un enfoque **mobile-first**, cálido y artesanal, que permite:
- Centralizar y registrar pedidos en segundos con cálculo automático de saldos y congelamiento histórico de precios.
- Organizar el flujo de trabajo mediante un **Tablero Kanban táctil** (Pendiente, En preparación, Listo, Entregado) adaptado al uso con celular en el taller.
- Mantener una **Agenda de Clientes habituales** con registro estricto de alergias, preferencias y vinculación automática de pedidos anteriores (**HU-02**).
- Gestionar un **Catálogo de Creaciones** con precios, alérgenos y disponibilidad en tiempo real.
- Consultar un **Dashboard con Recordatorios de entrega automáticos** (*Hoy, Mañana, Próximos 3 días*) y métricas de ventas periódicas.

---

## 4. Alcance del Sistema
### Dentro del alcance:
- Registro de clientes habituales y ocasionales.
- Catálogo de productos con categorías y protección de borrado de historial.
- Ciclo de vida completo del pedido y flujo Kanban.
- Cálculo automático de seña, adicionales y saldo pendiente.
- Alertas y recordatorios automáticos clasificados por fecha de entrega.
- Reportes periódicos de facturación y ranking de productos más pedidos.
- Arquitectura preparada para autenticación con control de roles (RBAC).

### Fuera del alcance (Fase actual):
- Control de stock de materia prima o inventario de ingredientes (harina, azúcar, huevos).
- Pasarela de pagos automatizada online (cobros con tarjeta de crédito en vivo).
- Portal de clientes para autogestión de compras.
