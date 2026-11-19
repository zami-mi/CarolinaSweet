# Lista Maestra de Tareas (Backlog de Ejecución) — Carolina Sweet

Este documento registra todas las tareas del proyecto con su identificador único, dependencias, prioridad, estado y criterios verificables de finalización.

---

## 1. Tabla de Tareas del Proyecto

| ID | Tarea / Módulo | Prioridad | Dependencias | Estado | Criterio de Finalización Verificado |
|---|---|---|---|---|---|
| **T01** | Esqueleto y Configuración Base | Alta | Ninguna | ✅ Terminada | Backend Express en :4000, Frontend Vite en :5173, scripts npm en raíz y health check respondiendo 200. |
| **T02** | Base de Datos SQLite y Esquema | Alta | T01 | ✅ Terminada | Tablas creadas con `node:sqlite`, claves foráneas activas, índices y semillas de demostración verificadas por tests. |
| **T03** | Catálogo de Productos y Categorías | Alta | T02 | ✅ Terminada | CRUD completo de productos con alérgenos, conmutador de disponibilidad y protección de borrado si hay pedidos. |
| **T04** | Agenda de Clientes y HU-02 | Alta | T02 | ✅ Terminada | Clientes habituales con alergias, soft-delete y vinculación automática HU-02 de pedidos previos por teléfono. |
| **T05** | Gestión y Creación de Pedidos | Alta | T03, T04 | ✅ Terminada | Cálculo de subtotal, adicionales, seña, saldo; congelamiento de precios históricos y bloqueo de edición fuera de Pendiente. |
| **T06** | Tablero Kanban y Transiciones | Alta | T05 | ✅ Terminada | 4 columnas táctiles con selector `<select>`, estampado de `delivered_at`, diálogo de reapertura y depuración de cancelados. |
| **T07** | Dashboard y Recordatorios Dinámicos | Media | T05, T06 | ✅ Terminada | Resumen métrico del mes en vivo y alertas clasificadas en *Hoy*, *Mañana* y *Próximos 3 días* sin descarte manual. |
| **T08** | Módulo de Reportes de Ventas | Media | T05, T06 | ✅ Terminada | Filtros de período (día, semana, mes, año), suma de entregados, ticket promedio y ranking visual de más vendidos. |
| **T09** | Testing Integral y Ciclo E2E | Alta | T01 a T08 | ✅ Terminada | Suite integral de ciclo de vida completo (Cliente -> Pedido -> Saldo -> Kanban -> Reportes -> Duplicación) con 100% pass. |
| **T10** | Preparación de Autenticación y RBAC | Media | T01 a T08 | ✅ Terminada | Middleware modular, endpoint `/api/auth/me`, inyección de usuario admin y tests de control de acceso por roles. |
| **T11** | Configuración de Despliegue en la Nube | Media | T01 a T10 | ✅ Terminada | Detección de API dinámica vía `VITE_API_URL`, script `npm run build` y Express sirviendo archivos estáticos en producción. |
| **T12** | Documentación Definitiva y Cierre | Media | T01 a T11 | ✅ Terminada | README.md completo, manual de despliegue y carpeta `docs/` con los 19 documentos técnicos e históricos. |

---

## 2. Detalle de Criterios de Aceptación por Tarea

### T01: Esqueleto y Configuración Base
- **Verificación:** Ejecución de `health.test.js` (2 pruebas pasando). Endpoint `GET /api/health` retorna `{ status: "ok" }`.

### T02: Base de Datos SQLite y Esquema
- **Verificación:** Ejecución de `database.test.js` (5 pruebas pasando). Verificación de tablas `users`, `clients`, `categories`, `products`, `orders`, `order_items` e integridad de saldos.

### T03: Catálogo de Productos y Categorías
- **Verificación:** Ejecución de `products.test.js` (7 pruebas pasando). Validación de precios no negativos, asociación de categorías y pausado automático ante borrado con pedidos.

### T04: Agenda de Clientes y HU-02
- **Verificación:** Ejecución de `clients.test.js` (5 pruebas pasando). Validación de teléfonos duplicados y test de vinculación automática de pedidos ocasionales a nuevo habitual (**HU-02**).

### T05: Creación y Gestión de Pedidos
- **Verificación:** Ejecución de `orders.test.js` (8 pruebas pasando). Validación de fecha de entrega $\ge \text{hoy}$, seña $\le \text{total}$ y bloqueo estricto de edición cuando no está en `Pendiente`.

### T06: Tablero Kanban y Transiciones de Estado
- **Verificación:** Ejecución de `kanban.test.js` (5 pruebas pasando). Cambio de estado mediante select, guardado de `delivered_at` y test de reapertura permitida.

### T07: Dashboard y Recordatorios Dinámicos
- **Verificación:** Ejecución de `dashboard.test.js` (2 pruebas pasando). Métricas numéricas válidas y separación de alertas en `today`, `tomorrow` y `upcoming`.

### T08: Reportes Periódicos de Ventas
- **Verificación:** Ejecución de `reports.test.js` (5 pruebas pasando). Filtros temporales válidos (`day`, `week`, `month`, `year`) y ranking de productos entregados.

### T09: Pruebas de Integración y Ciclo E2E
- **Verificación:** Ejecución de `integration.test.js` (1 prueba E2E completa pasando). Ciclo completo sin mockeos validado en SQLite.

### T10: Autenticación y RBAC
- **Verificación:** Ejecución de `auth.test.js` (4 pruebas pasando). Paso permitido a rol admin y bloqueo 403 a roles no autorizados.

### T11: Despliegue y Responsive
- **Verificación:** Compilación limpia de Vite con `npm run build` y suite completa de 44 pruebas verdes.

### T12: Documentación Definitiva
- **Verificación:** Existencia de `README.md`, `AGENTS.md`, carpeta `docs/` (archivos 01 a 19) y los 7 archivos raíz de la consigna (`idea.md`, `decisiones.md`, `glosario.md`, `preguntas-abiertas.md`, `spec.md`, `plan.md`, `tasks.md`).

---

*Total de tareas completadas: 12 de 12 (100%). Total de tests: 44 pruebas pasando sin fallos.*
