# Registro de Decisiones de Arquitectura: Carolina Sweet

Registro cronológico de las decisiones técnicas y de diseño adoptadas en el proyecto y sus justificaciones:

---

## 1: Uso del Módulo Nativo `node:sqlite` en lugar de `better-sqlite3`
- **Contexto:** `better-sqlite3` requería compilación nativa con Visual Studio Build Tools C++, lo cual causaba fallos de instalación en el entorno local de desarrollo.
- **Decisión:** Emplear la API síncrona integrada en Node.js 24 (`node:sqlite`, clase `DatabaseSync`).
- **Consecuencias:** Instalación 100% limpia sin dependencias nativas pesadas, excelente rendimiento síncrono y compatibilidad directa en Windows y Linux.

---

## 2: Selector Táctil (`<select>`) en Kanban en lugar de Arrastrar y Soltar (*Drag & Drop*)
- **Contexto:** En la maqueta original y en talleres artesanales, las pasteleras suelen manipular el teléfono con una sola mano o dedos con restos de harina. El arrastre táctil suele causar soltados accidentales en columnas equivocadas.
- **Decisión:** Cada tarjeta incorpora un selector desplegable táctil explícito para cambiar de estado (`Pendiente`, `En preparación`, `Listo`, `Entregado`).
- **Consecuencias:** Cero desplazamientos accidentales, mayor velocidad de cambio y perfecta ergonomía móvil.

---

## 3: Congelamiento Histórico de Precios en `order_items`
- **Contexto:** Los precios del catálogo cambian con el tiempo debido a la inflación de materias primas.
- **Decisión:** Al guardar un pedido, se almacena el precio unitario exacto en la fila del ítem (`order_items.unit_price`).
- **Consecuencias:** Si se actualiza el precio de una torta en el catálogo, los pedidos pasados o en curso no sufren alteraciones contables.

---

## 4: Vinculación Automática de Pedidos de Ocasionales
- **Contexto:** Muchos clientes inician pidiendo por WhatsApp como ocasionales y tiempo después se convierten en clientas habituales.
- **Decisión:** Usar el número de teléfono como clave unificadora. Al dar de alta un cliente habitual, el backend busca y asocia de inmediato los pedidos ocasionales con ese número.
- **Consecuencias:** Consolidación instantánea del historial de compras sin requerir migraciones manuales.

---

## 5: Aislamiento de Base de Datos para Pruebas (`carolina_sweet_test.db`)
- **Contexto:** La ejecución continua de `npm test` acumulaba registros de prueba en la base de datos de desarrollo, duplicando tarjetas visibles en la interfaz.
- **Decisión:** Detectar el entorno de test (`process.env.npm_lifecycle_event === 'test'`) en `env.js` y redirigir las pruebas a un archivo aislado `carolina_sweet_test.db`.
- **Consecuencias:** La base de datos principal de Carolina permanece impecable e inmune a las pruebas automáticas.
