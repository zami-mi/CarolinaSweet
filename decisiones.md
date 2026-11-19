# Registro de Decisiones de Arquitectura y Funcionales (ADR) — Carolina Sweet

Este documento registra las decisiones clave tomadas a lo largo del ciclo de vida del proyecto, sus motivaciones, alternativas evaluadas y su estado formal de aprobación.

---

## 1. Decisiones Técnicas

### - Uso de `node:sqlite` nativo (Node.js 24) en lugar de `better-sqlite3`
- **Fecha:** Inicio de T02
- **Estado:** ✅ Aprobada e Implementada
- **Motivo:** `better-sqlite3` requiere compilación C++ con herramientas pesadas de Visual Studio Build Tools, lo que provocaba fallos de instalación en el entorno local de desarrollo.
- **Alternativas consideradas:**
  - *better-sqlite3:* Descartada por dependencia de compiladores nativos externos.
  - *sqlite3 clásico con bindings:* Descartada por APIs asíncronas basadas en callbacks legadas.
  - *node:sqlite (Node 24 nativo):* Aprobada por ser una API síncrona integrada en el runtime, ultraligera y sin dependencias de instalación.

---

### - SQLite en Modo WAL y Claves Foráneas Activas
- **Fecha:** T02
- **Estado:** ✅ Aprobada e Implementada
- **Motivo:** Garantizar integridad referencial (`PRAGMA foreign_keys = ON;`) y permitir lecturas concurrentes rápidas sin bloqueos entre hilos (`PRAGMA journal_mode = WAL;`).
- **Alternativas consideradas:** Modo rollback journal tradicional (descartado por bloqueos de tabla completos).

---

### - Concurrencia unitaria en Tests (`--test-concurrency=1`) y Base de Datos Aislada
- **Fecha:** T06 / T12
- **Estado:** ✅ Aprobada e Implementada
- **Motivo:** Al ejecutar múltiples archivos de prueba en paralelo contra una base de datos local SQLite, se generaban bloqueos de escritura (*"database is locked"*). Además, los tests ensuciaban la base de datos de desarrollo con datos de prueba repetidos.
- **Decisión:** Configurar `--test-concurrency=1` en los scripts de prueba y aislar las pruebas en `carolina_sweet_test.db` detectando `process.env.npm_lifecycle_event === 'test'`.
- **Estado:** ✅ Aprobada e Implementada.

---

### - Soporte Unificado de Frontend en Express para Producción
- **Fecha:** T11
- **Estado:** ✅ Aprobada e Implementada
- **Motivo:** Permitir que Carolina Sweet pueda desplegarse como un único servicio en la nube (ej. Render Web Service) sirviendo los archivos estáticos de `client/dist` en la raíz `/` y la API en `/api/*`, reduciendo costos y complejidad.
- **Alternativas consideradas:** Despliegue separado obligatorio (también soportado vía variable de entorno `VITE_API_URL`).

---

## 2. Decisiones Funcionales y de Negocio

### - Selector Táctil (`<select>`) en Kanban en lugar de Arrastrar y Soltar (*Drag & Drop*)
- **Fecha:** Definición de SPEC
- **Estado:** ✅ Aprobada e Implementada
- **Motivo:** En el taller de pastelería, el celular se utiliza con dedos manchados de harina o manteca. El drag & drop táctil genera desplazamientos involuntarios y errores de columna. El menú desplegable garantiza intencionalidad y precisión.
- **Alternativas consideradas:** Drag & drop con librerías pesadas (descartado por ergonomía y accesibilidad).

---

### - Congelamiento Histórico de Precios en `order_items`
- **Fecha:** T05
- **Estado:** ✅ Aprobada e Implementada
- **Motivo:** Si Carolina ajusta el precio de catálogo de una torta debido al costo de insumos, los pedidos ya tomados o entregados deben preservar el precio unitario acordado originalmente.
- **Alternativas consideradas:** Consultar dinámicamente el precio de `products.base_price` (descartado porque alteraría el historial de facturación).

---

### - Vinculación Automática por Teléfono (HU-02)
- **Fecha:** T04
- **Estado:** ✅ Aprobada e Implementada
- **Motivo:** Muchas clientas compran primero como ocasionales por WhatsApp. Al registrarlas formalmente como habituales, el sistema asocia de inmediato todos los pedidos previos realizados con ese número.
- **Alternativas consideradas:** Botón manual de vinculación (descartado para evitar fricción operativa).

---

### - Inmutabilidad de Pedidos fuera de 'Pendiente'
- **Fecha:** T05
- **Estado:** ✅ Aprobada e Implementada
- **Motivo:** Evitar que se modifiquen productos, cantidades o fechas cuando la torta ya comenzó a hornearse o decorarse en la cocina.
- **Mecanismo de excepción:** Para corregir un pedido entregado, se requiere una acción explícita de reapertura con confirmación.
