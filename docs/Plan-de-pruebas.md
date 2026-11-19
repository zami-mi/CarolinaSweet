# Plan de Pruebas: Carolina Sweet

Estrategia integral de aseguramiento de calidad (QA) para validar la corrección técnica y el cumplimiento de las reglas de negocio.

---

## 1. Alcance de las Pruebas
El plan cubre:
- **Pruebas de Esquema e Integridad Relacional:** Existencia de tablas, índices y consistencia de claves foráneas.
- **Pruebas Unitarias de Controladores:** Validación de datos de entrada y códigos de respuesta HTTP.
- **Pruebas de Reglas de Negocio:** Validación de seña, fechas futuras, inmutabilidad de pedidos fuera de Pendiente y vinculación HU-02.
- **Pruebas de Integración E2E:** Flujo completo de un pedido desde su creación hasta la entrega y reporte final.
- **Pruebas de Autenticación y RBAC:** Verificación de middleware de permisos.

---

## 2. Herramientas Utilizadas
- **Test Runner:** Módulo nativo `node:test` de Node.js.
- **Aserciones:** Módulo nativo `node:assert`.
- **Aislamiento:** Concurrencia controlada (`--test-concurrency=1`) y base de datos de prueba separada (`carolina_sweet_test.db`).

---

## 3. Matriz de Suites de Prueba

| Archivo de Prueba | Módulo / Funcionalidad Evaluada |
|---|---|
| `health.test.js` | Endpoint `/api/health` y respuesta 404 ante rutas no encontradas. |
| `database.test.js`| Esquema SQLite, índices, semillas y restricciones de saldos. |
| `products.test.js` | CRUD de catálogo, categorías, validación de precio y pausado por historial. |
| `clients.test.js` | Clientes habituales, unicidad de teléfono, HU-02 y soft-delete. |
| `orders.test.js` | Creación de pedidos, cálculo de saldo, regla de fecha y bloqueo de edición. |
| `kanban.test.js` | Transiciones de estado, `delivered_at`, confirmación de reapertura y limpieza. |
| `dashboard.test.js`| Métricas del resumen mensual y recordatorios clasificados por fecha. |
| `reports.test.js` | Métricas filtradas por día/semana/mes/año y ranking de más vendidos. |
| `auth.test.js` | Perfil `/api/auth/me`, paso de rol admin y bloqueo 403 para roles insuficientes. |
| `integration.test.js`| Ciclo de vida completo de extremo a extremo (E2E). |
