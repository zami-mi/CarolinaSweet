# Criterios de Aceptación: Carolina Sweet

Criterios de verificación en formato **Dado / Cuando / Entonces** (*Given / When / Then*) para validar formalmente el cumplimiento de cada historia de usuario:

---

### 1: Alta de Pedido Ocasional
- **Dado** que Carolina necesita registrar un pedido entrante por WhatsApp,
- **Cuando** ingresa el nombre ocasional, teléfono, selecciona al menos 1 producto disponible con cantidad, define una fecha de entrega válida ($\ge \text{hoy}$) e ingresa una seña opcional,
- **Entonces** el sistema guarda el pedido con estado `Pendiente`, calcula el total y saldo pendiente correctamente, y muestra la tarjeta en la columna correspondiente del Kanban.

---

### 2: Vinculación Automática por Teléfono (HU-02)
- **Dado** que existen 1 o más pedidos registrados a nombre de un cliente ocasional con el teléfono `1123456789`,
- **Cuando** Carolina crea un nuevo cliente habitual ingresando ese mismo número `1123456789`,
- **Entonces** el sistema crea la ficha habitual y actualiza automáticamente el campo `client_id` de todos los pedidos históricos que compartían ese teléfono, consolidando su historial.

---

### 3: Rechazo de Fecha de Entrega en el Pasado
- **Dado** que el usuario está creando o editando un pedido en estado `Pendiente`,
- **Cuando** selecciona una fecha de entrega anterior a la fecha de hoy,
- **Entonces** el sistema rechaza la petición con código HTTP `400` y muestra el mensaje: *"La fecha de entrega debe ser hoy o una fecha posterior"*.

---

### 4: Rechazo de Seña Superior al Total
- **Dado** que un pedido tiene un monto total de \$25.000,
- **Cuando** el usuario intenta registrar un anticipo/seña de \$30.000,
- **Entonces** el sistema bloquea el guardado informando que la seña no puede superar el monto total del pedido.

---

### 5: Transición de Estados en Kanban
- **Dado** que un pedido está en la columna `Pendiente`,
- **Cuando** Carolina selecciona la opción `"En preparación"` en el menú desplegable táctil,
- **Entonces** la tarjeta se mueve de inmediato a la columna `En preparación` y los contadores del panel se actualizan automáticamente.

---

### 6: Bloqueo de Edición fuera de Pendiente
- **Dado** que un pedido se encuentra en estado `En preparación`, `Listo` o `Entregado`,
- **Cuando** se intenta enviar una solicitud `PUT /api/orders/:id` para modificar ítems, cantidades o fecha,
- **Entonces** la API retorna error `400` con el mensaje: *"Solo se pueden editar pedidos en estado Pendiente"*.

---

### 7: Estampado y Reapertura de Entregas
- **Dado** que un pedido pasa al estado `Entregado`,
- **Cuando** se registra el cambio,
- **Entonces** el sistema guarda la fecha y hora exacta en `delivered_at`.
- **Y si** posteriormente el usuario solicita reabrirlo a `En preparación`,
- **Entonces** el sistema solicita confirmación y, tras ser aprobada, borra el valor de `delivered_at` y devuelve el pedido al flujo activo.

---

### 8: Cálculo de Métricas en Reportes
- **Dado** que existen pedidos en diversos estados durante el mes actual,
- **Cuando** se consulta `GET /api/reports?period=month`,
- **Entonces** el sistema suma únicamente los ingresos de pedidos con `status = 'Entregado'` cuya fecha de entrega corresponda al mes en curso, omitiendo pedidos pendientes o cancelados.
