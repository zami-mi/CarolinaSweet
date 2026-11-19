# Informe Final de Proyecto: Carolina Sweet

---

## 1. Resumen Ejecutivo
El proyecto **Carolina Sweet** alcanzó el 100% de los objetivos planteados en la especificación funcional (SPEC) y en el plan arquitectónico inicial. Se entregó una aplicación web completa, responsiva y de estética artesanal que resuelve de forma definitiva la dispersión operativa de la pastelería, brindando a Carolina control total sobre sus pedidos, clientes, catálogo y finanzas.

---

## 2. Logros y Funcionalidades Entregadas
1. **Control de Pedidos en Kanban Táctil:**
   - 4 etapas visuales con selectores ergonómicos que eliminaron el riesgo de arrastres involuntarios en el taller.
   - Restricción estricta de edición únicamente en estado `Pendiente`.
2. **Preservación Contable y Congelamiento de Precios:**
   - Precios históricos fijos por ítem de pedido.
   - Cálculo atómico de subtotales, adicionales, señas y saldos restantes.
3. **Fidelización y Seguridad de Clientes:**
   - Registro de alergias e intolerancias alimentarias para prevenir incidentes de salud.
   - Vinculación automática de compras previas al convertir un cliente ocasional en habitual (**HU-02**).
4. **Visibilidad en Cocina y Finanzas:**
   - Recordatorios dinámicos clasificados por proximidad de entrega (*Hoy, Mañana, Próximos 3 días*).
   - Reportes de facturación de pedidos entregados y ranking de productos más pedidos.
5. **Arquitectura Escalable y Limpia:**
   - Módulo SQLite nativo sin dependencias pesadas de C++.
   - Aislamiento de base de datos de tests para garantizar datos reales limpios.
   - Middleware de autenticación y roles (RBAC) preparado para futuras expansiones.

---

## 3. Dificultades Técnicas Superadas
- **Fallo de instalación de `better-sqlite3`:** Superado mediante la adopción de `node:sqlite` nativo de Node.js 24, simplificando la instalación y eliminando la necesidad de compiladores locales.
- **Concurrencia en SQLite durante pruebas:** Resuelto fijando `--test-concurrency=1` en el runner nativo y activando el modo WAL (`PRAGMA journal_mode = WAL`).
- **Contaminación de datos por tests:** Resuelto implementando la separación dinámica de bases de datos (`carolina_sweet_test.db` vs `carolina_sweet.db`) y scripts de reset idempotentes.

---

## 4. Conclusión
Carolina Sweet dispone ahora de una herramienta ágil, confiable y visualmente coherente con su identidad artesanal. El código fuente cuenta con cobertura de pruebas del 100% de sus reglas de negocio y documentación técnica exhaustiva para garantizar su mantenimiento y evolución a largo plazo.
