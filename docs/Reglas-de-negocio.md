# Reglas de Negocio: Carolina Sweet

Las reglas de negocio definen las condiciones, restricciones y directrices operativas que el sistema debe hacer cumplir de forma estricta.

---

## 1: Identificador Único de Cliente y Vinculación
1. El **número de teléfono** es el identificador principal y único de cada cliente en el sistema.
2. No pueden existir dos clientes habituales activos con el mismo teléfono.
3. Si un cliente realizó pedidos previos como "Ocasional" (sin registrarse) y luego Carolina decide cargarlo como "Habitual", el sistema debe ejecutar la regla **HU-02**: asociar automáticamente al nuevo cliente todos los pedidos anteriores registrados con ese número.

---

## 2: Preservación del Historial (Soft-Delete)
1. **Productos:** Si un producto tiene pedidos asociados, no puede ser eliminado físicamente. El sistema lo marca como `is_available = 0` (pausado).
2. **Clientes:** Si un cliente habitual tiene pedidos, no se elimina de la base de datos. Se actualiza su estado a `is_active = 0` (inactivo), impidiendo seleccionarlo para nuevos pedidos pero conservando su historial en reportes y estadísticas.

---

## 3: Congelamiento Histórico de Precios
1. Cuando se crea un pedido, el precio unitario de cada producto se copia de forma estática en la tabla `order_items`.
2. Si Carolina actualiza el precio base de una torta en el catálogo semanas después, **los pedidos pasados o pendientes mantienen intacto el precio acordado originalmente**.

---

## 4: Disponibilidad de Productos en Pedidos
1. Solo se pueden agregar a nuevos pedidos aquellos productos que tengan `is_available = 1`.
2. Si se intenta crear un pedido con un producto pausado mediante la API o interfaz, el sistema rechazará la solicitud con un error explícito.

---

## 5: Cálculos Financieros y Límites de Seña
1. El total del pedido es la suma de los subtotales de los productos más cualquier adicional personalizado:
   $$\text{Total} = \text{Subtotal} + \text{Adicionales}$$
2. La seña o anticipo abonado **nunca puede ser mayor al total del pedido**:
   $$0 \le \text{Seña} \le \text{Total}$$
3. El saldo restante a cobrar en la entrega es:
   $$\text{Saldo Pendiente} = \text{Total} - \text{Seña}$$

---

## 6: Fechas de Entrega Válidas
1. La fecha comprometida de entrega debe ser **igual o posterior a la fecha actual** del sistema ($\text{delivery\_date} \ge \text{today}$).
2. No se admiten pedidos nuevos con fechas pasadas.

---

## 7: Inmutabilidad por Estado (Edición solo en Pendiente)
1. Un pedido solo puede ser modificado en sus ítems, cantidades, adicionales y fecha mientras se encuentre en estado **`Pendiente`**.
2. Si el pedido pasa a `En preparación`, `Listo`, `Entregado` o `Cancelado`, cualquier intento de edición vía API o interfaz quedará estrictamente bloqueado.

---

## 8: Ciclo de Vida y Transiciones Kanban
1. Estados permitidos: `Pendiente`, `En preparación`, `Listo`, `Entregado`, `Cancelado`.
2. Al marcar un pedido como `Entregado`:
   - Se estampa automáticamente la fecha y hora de entrega (`delivered_at = CURRENT_TIMESTAMP`).
3. Para revertir un pedido `Entregado` a otro estado (por ejemplo ante un error de tipeo):
   - Se exige confirmación expresa de reapertura.
   - Se limpia la marca `delivered_at` (`NULL`).

---

## 9: Depuración de Cancelados
1. Los pedidos en estado `Cancelado` se conservan para auditoría y se pueden depurar de forma automática o bajo demanda únicamente si superan los 365 días desde su cancelación.
