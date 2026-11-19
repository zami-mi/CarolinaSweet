# Registro de Preguntas Abiertas y Decisiones Pendientes — Carolina Sweet

Este documento registra las dudas, decisiones de diseño y cuestiones operativas analizadas a lo largo del proyecto, su estado actual y las confirmaciones brindadas por la desarrolladora responsable.

---

## 1. Preguntas Resueltas durante la Etapa de Análisis y Desarrollo

| ID | Cuestión / Pregunta | Decisión Tomada | Confirmado Por | Estado |
|---|---|---|---|---|
| **1-** | ¿Se requiere inicio de sesión (login) obligatorio en la fase inicial? | No. Se decidió operar en **modo taller abierto** (usuario Carolina admin simulado automáticamente) para maximizar la velocidad de uso diario en la cocina, dejando la arquitectura preparada para activar JWT con `AUTH_REQUIRED=true` en el futuro. | Responsable | ✅ Cerrada |
| **2-** | ¿Se deben controlar stocks de materia prima (harina, huevos, azúcar)? | No. Se excluyó expresamente el inventario de ingredientes para mantener la aplicación simple, enfocada y sin sobrecarga administrativa. | Responsable | ✅ Cerrada |
| **3-** | ¿Cómo interactúa el usuario con el tablero Kanban en celulares? | Se utiliza un **selector desplegable táctil (`<select>`)** en cada tarjeta en lugar de arrastrar y soltar (*drag & drop*), evitando soltados accidentales en columnas equivocadas. | Responsable | ✅ Cerrada |
| **4-** | ¿Qué ocurre con los precios si Carolina actualiza el valor de una torta en el catálogo? | Se aplica **congelamiento histórico de precios**: cada ítem del pedido almacena su precio unitario al momento de crearse, sin verse afectado por futuros cambios de catálogo. | Responsable | ✅ Cerrada |
| **5-** | ¿Se permite modificar un pedido cuando ya se está elaborando en cocina? | No. La edición de productos, cantidades y fechas está restringida exclusivamente al estado **`Pendiente`**. | Responsable | ✅ Cerrada |
| **6-** | ¿Se pueden eliminar productos que ya fueron vendidos en pedidos anteriores? | No se eliminan físicamente. El sistema aplica **baja lógica (*soft-delete*)**, pausando el producto (`is_available = 0`) para proteger el historial contable. | Responsable | ✅ Cerrada |
| **7-** | ¿Cómo se vinculan pedidos de clientas que primero compraron como ocasionales por WhatsApp? | Se utiliza la regla **HU-02**: al registrar un cliente habitual, el sistema busca y asocia de inmediato todos los pedidos anteriores registrados con ese mismo número de teléfono. | Responsable | ✅ Cerrada |
| **8-** | ¿Cómo se calculan los reportes periódicos de ventas? | Se calculan en tiempo real sumando exclusivamente los pedidos con estado **`Entregado`** filtrados por la fecha de entrega comprometida. | Responsable | ✅ Cerrada |

---

## 2. Decisiones Futuras (Fase 2 / Evolución Posterior)

| ID | Cuestión para Fase Futura | Opciones Evaluadas | Estado |
|---|---|---|---|
| **1-** | Notificaciones automáticas por WhatsApp Web | Integrar la API de WhatsApp Cloud o enlaces `https://wa.me/` automáticos para avisar *"Tu pedido está listo para retirar"*. | 💡 Propuesta para Fase 2 |
| **2-** | Pasarela de cobros en línea de señas | Integración con Mercado Pago / transferencia bancaria con carga de comprobante en imagen. | 💡 Propuesta para Fase 2 |
| **3-** | Módulo de gastos operativos | Registro de compras de packaging, insumos y cálculo de margen de ganancia neto. | 💡 Propuesta para Fase 2 |

