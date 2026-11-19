# Especificación de la API REST: Carolina Sweet

Base URL en desarrollo: `http://localhost:4000/api`

---

## 1. Salud y Autenticación
| Método | Endpoint | Descripción | Respuesta exitosa |
|---|---|---|---|
| `GET` | `/health` | Chequeo de estado del servidor y uptime | `200 { status: 'ok', uptime, timestamp }` |
| `GET` | `/auth/me` | Devuelve usuario activo y estado de autenticación | `200 { user: { id, username, role }, auth_enabled }` |

---

## 2. Categorías
| Método | Endpoint | Descripción | Respuesta |
|---|---|---|---|
| `GET` | `/categories` | Listar todas las categorías | `200 { data: [...] }` |
| `POST` | `/categories` | Crear nueva categoría | `201 { data: { id, name, ... } }` |

---

## 3. Catálogo de Productos
| Método | Endpoint | Parámetros query | Descripción |
|---|---|---|---|
| `GET` | `/products` | `category_id`, `available_only`, `featured_only` | Listado filtrable de productos |
| `GET` | `/products/:id` | - | Detalle de un producto |
| `POST` | `/products` | Body: `{ name, base_price, category_id, allergens, ... }` | Crear producto nuevo |
| `PUT` | `/products/:id` | Body: `{ name, base_price, allergens, ... }` | Actualizar producto |
| `PATCH` | `/products/:id/availability` | Body: `{ is_available: 0 \| 1 }` | Conmutar disponibilidad |
| `DELETE` | `/products/:id` | - | Elimina si no tiene historial; si tiene pedidos, lo pausa |

---

## 4. Agenda de Clientes
| Método | Endpoint | Parámetros query | Descripción |
|---|---|---|---|
| `GET` | `/clients` | `search`, `include_inactive` | Listado con búsqueda por nombre o teléfono |
| `GET` | `/clients/:id` | - | Detalle del cliente e historial de pedidos |
| `POST` | `/clients` | Body: `{ name, phone, notes, allergies }` | Registrar cliente habitual (ejecuta HU-02) |
| `PUT` | `/clients/:id` | Body: `{ name, phone, notes, allergies }` | Actualizar datos del cliente |
| `PATCH` | `/clients/:id/status` | Body: `{ is_active: 0 \| 1 }` | Desactivar / Reactivar cliente (*soft-delete*) |

---

## 5. Gestión de Pedidos y Kanban
| Método | Endpoint | Descripción | Códigos |
|---|---|---|---|
| `GET` | `/orders` | Listar pedidos (filtros: `status`, `client_id`, `date`, `favorite_only`, `search`) | `200` |
| `GET` | `/orders/:id` | Detalle completo con ítems y datos del cliente | `200`, `404` |
| `POST` | `/orders` | Crear nuevo pedido con ítems, adicionales y cálculo financiero | `201`, `400` |
| `PUT` | `/orders/:id` | Modificar pedido (bloqueado si el pedido no está en `Pendiente`) | `200`, `400` |
| `PATCH` | `/orders/:id/status` | Actualizar estado en el Kanban (`Pendiente`, `En preparación`, `Listo`, `Entregado`) | `200`, `400` |
| `PATCH` | `/orders/:id/favorite` | Conmutar estado de favorito | `200` |
| `POST` | `/orders/:id/duplicate` | Duplica un pedido como nuevo en `Pendiente` para nueva fecha | `201`, `404` |
| `POST` | `/orders/cleanup-cancelled`| Depura pedidos cancelados con más de 365 días | `200` |

---

## 6. Dashboard y Recordatorios
| Método | Endpoint | Descripción | Respuesta |
|---|---|---|---|
| `GET` | `/dashboard/summary` | Facturación mensual de entregados, pedidos pendientes y próximas entregas | `200 { data: { monthly_sales, pending_orders_count, upcoming_deliveries_count } }` |
| `GET` | `/dashboard/reminders`| Alertas clasificadas en `today`, `tomorrow` y `upcoming` (próximos 3 días) | `200 { data: { today: [...], tomorrow: [...], upcoming: [...] }, total_alerts }` |

---

## 7. Reportes Periódicos
| Método | Endpoint | Parámetros query | Descripción |
|---|---|---|---|
| `GET` | `/reports` | `period=day\|week\|month\|year` | Métricas de ventas: total facturado, ticket promedio, top 5 productos y pedidos por estado |
