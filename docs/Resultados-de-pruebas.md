# Resultados de Pruebas Automatizadas: Carolina Sweet

Registro de ejecución y evidencia del paso exitoso del 100% de las pruebas automatizadas del proyecto.

---

## 1. Resumen Global de Ejecución
- **Total de Suites:** 10
- **Total de Pruebas Ejecutadas:** 44
- **Pruebas Aprobadas (Pass):** 44 (100%)
- **Pruebas Fallidas (Fail):** 0 (0%)
- **Pruebas Canceladas:** 0
- **Duración Promedio de Suite Completa:** ~7.1 segundos

---

## 2. Detalle por Suite de Pruebas

```text
▶ T10 – Preparación de Autenticación y RBAC
  ✔ GET /api/auth/me devuelve el usuario activo por defecto y estado de autenticación
  ✔ Middleware requireRole permite el paso cuando el rol coincide
  ✔ Middleware requireRole bloquea con 403 cuando el rol no tiene permisos
  ✔ Middleware requireRole bloquea con 401 si req.user no existe
✔ T10 – Preparación de Autenticación y RBAC (4 pass)

▶ Módulo de Clientes (API)
  ✔ GET /api/clients retorna lista de clientes activos
  ✔ POST /api/clients valida teléfono duplicado
  ✔ HU-02: Registrar cliente habitual vincula automáticamente pedidos previos de ocasionales con ese teléfono
  ✔ GET /api/clients/:id retorna historial de pedidos del cliente
  ✔ PATCH /api/clients/:id/status permite desactivación (soft delete) y reactivación
✔ Módulo de Clientes (API) (5 pass)

▶ Módulo Dashboard y Recordatorios (API)
  ✔ GET /api/dashboard/summary retorna métricas numéricas válidas
  ✔ GET /api/dashboard/reminders retorna recordatorios clasificados por Hoy, Mañana y Próximos 3 días
✔ Módulo Dashboard y Recordatorios (API) (2 pass)

▶ Base de Datos SQLite y Esquema
  ✔ Todas las tablas requeridas por la SPEC existen
  ✔ Los índices requeridos existen
  ✔ Los datos semilla se cargan y son consistentes
  ✔ La integridad de saldos en pedidos es coherente (Total = Seña + Saldo)
  ✔ Restricción UNIQUE en teléfono de clientes habituales
✔ Base de Datos SQLite y Esquema (5 pass)

▶ API Health Check
  ✔ GET /api/health retorna 200 y status ok
  ✔ GET /api/ruta-inexistente retorna 404
✔ API Health Check (2 pass)

▶ T09 – Pruebas de Integración y Ciclo de Vida Completo
  ✔ Ciclo E2E: Cliente -> Pedido -> Saldo -> Kanban -> Reportes -> Duplicación
✔ T09 – Pruebas de Integración y Ciclo de Vida Completo (1 pass)

▶ Módulo Kanban y Transiciones de Estado (API)
  ✔ PATCH /api/orders/:id/status actualiza de Pendiente a En preparación
  ✔ PATCH /api/orders/:id/status a "Entregado" registra delivered_at
  ✔ Reapertura permitida: Cambiar de Entregado a En preparación para corrección limpia delivered_at
  ✔ PATCH /api/orders/:id/status rechaza estados no permitidos
  ✔ POST /api/orders/cleanup-cancelled depura pedidos cancelados con más de 365 días
✔ Módulo Kanban y Transiciones de Estado (API) (5 pass)

▶ Módulo de Pedidos (API)
  ✔ GET /api/orders retorna lista de pedidos
  ✔ POST /api/orders crea un pedido válido con cliente habitual y calcula saldo
  ✔ POST /api/orders rechaza fecha de entrega en el pasado
  ✔ POST /api/orders rechaza seña mayor al total
  ✔ POST /api/orders rechaza producto no disponible
  ✔ PUT /api/orders/:id BLOQUEA edición si el pedido no está en estado Pendiente
  ✔ POST /api/orders/:id/duplicate duplica un pedido como nuevo en Pendiente
  ✔ PATCH /api/orders/:id/favorite conmuta el estado de favorito
✔ Módulo de Pedidos (API) (8 pass)

▶ Módulo de Catálogo y Categorías (API)
  ✔ GET /api/categories retorna listado de categorías
  ✔ POST /api/categories valida nombre obligatorio
  ✔ GET /api/products retorna productos con nombre de categoría
  ✔ POST /api/products valida que el precio no sea negativo
  ✔ POST /api/products crea un producto nuevo exitosamente
  ✔ PATCH /api/products/:id/availability cambia disponibilidad
  ✔ DELETE /api/products/:id pausa el producto si tiene pedidos asociados para proteger el historial
✔ Módulo de Catálogo y Categorías (API) (7 pass)

▶ T08 – Reports
  ✔ GET /api/reports sin period usa mes por defecto (200)
  ✔ GET /api/reports?period=day devuelve estructura válida
  ✔ GET /api/reports?period=week devuelve estructura válida
  ✔ GET /api/reports?period=year devuelve top_products como array
  ✔ GET /api/reports?period=invalido devuelve 400
✔ T08 – Reports (5 pass)
```
