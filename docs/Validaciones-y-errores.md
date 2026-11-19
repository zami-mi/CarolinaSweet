# 12 — Validaciones y Manejo de Errores: Carolina Sweet

El sistema implementa una doble barrera de validación (frontend interactivo y backend estricto) para garantizar la solidez de los datos y respuestas consistentes ante errores.

---

## 1. Matriz de Validaciones de Negocio

| Entidad | Campo / Regla | Condición / Validación | Código HTTP | Mensaje de Error |
|---|---|---|---|---|
| **Clientes** | `name` | Obligatorio, texto no vacío | `400` | `"El nombre del cliente es obligatorio"` |
| **Clientes** | `phone` | Obligatorio, único entre clientes habituales | `400` | `"Ya existe un cliente habitual registrado con este número"` |
| **Productos**| `name` | Obligatorio, texto no vacío | `400` | `"El nombre del producto es obligatorio"` |
| **Productos**| `base_price` | Numérico, $\ge 0$ | `400` | `"El precio debe ser un número mayor o igual a cero"` |
| **Pedidos**  | `items` | Array con al menos 1 producto | `400` | `"El pedido debe contener al menos un producto"` |
| **Pedidos**  | `delivery_date`| Fecha válida $\ge \text{fecha actual}$ | `400` | `"La fecha de entrega debe ser hoy o una fecha posterior"` |
| **Pedidos**  | `deposit_paid` | $0 \le \text{deposit} \le \text{total}$ | `400` | `"La seña no puede superar el monto total del pedido"` |
| **Pedidos**  | `items.is_available`| El producto debe estar disponible ($1$) | `400` | `"El producto '[Nombre]' no está disponible para nuevos pedidos"` |
| **Pedidos**  | Edición (`PUT`)| Estado debe ser `'Pendiente'` | `400` | `"Solo se pueden editar pedidos en estado Pendiente"` |
| **Pedidos**  | `status` | Pertenecer a los estados permitidos | `400` | `"Estado de pedido no válido"` |
| **Reportes** | `period` | Uno de: `'day'`, `'week'`, `'month'`, `'year'` | `400` | `"Período inválido. Usar: day, week, month, year"` |

---

## 2. Tratamiento de Respuestas de Error
Toda respuesta de error en la API sigue una estructura JSON predecible:

```json
{
  "error": "Mensaje descriptivo claro y en español"
}
```

### Códigos de Estado Estándar Utilizados:
- **`200 OK`**: Petición resuelta exitosamente.
- **`201 Created`**: Recurso creado exitosamente (pedido, producto o cliente).
- **`400 Bad Request`**: Datos incompletos, inconsistentes o violación de reglas de negocio.
- **`401 Unauthorized`**: Falta de token cuando la autenticación está activa (`AUTH_REQUIRED=true`).
- **`403 Forbidden`**: El usuario no cuenta con el rol suficiente (RBAC).
- **`404 Not Found`**: El recurso solicitado (ej. pedido con ID inexistente) no existe.
- **`500 Internal Server Error`**: Excepción no controlada; el middleware central captura el error y devuelve un mensaje seguro sin exponer información interna.
