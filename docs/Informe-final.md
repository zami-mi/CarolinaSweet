# Informe Final de Proyecto: Carolina Sweet

---

## A. Presentación del Proyecto
- **Nombre:** Carolina Sweet — Sistema de Gestión para Pastelería Artesanal.
- **Problema:** En el funcionamiento cotidiano de la pastelería artesanal existía una marcada dispersión de información. Los pedidos ingresaban por WhatsApp, llamadas o encargos presenciales y se registraban en cuadernos o papeles sueltos. Esto ocasionaba extravío de pedidos, falta de trazabilidad en las etapas de cocina (horno, armado, decoración, entrega), desconocimiento o confusión respecto a las alergias de clientas habituales (riesgo sanitario con celiaquía o frutos secos) y falta de control sobre señas cobradas, saldos restantes y facturación mensual.
- **Objetivos:** Desarrollar una aplicación web centralizada, mobile-first y artesanal que permita gestionar de forma ágil pedidos, catálogo de creaciones, agenda de clientes, recordatorios de entrega y reportes de ventas.
- **Alcance:**
  - *Incluido:* Gestión integral de pedidos con cálculo automático de saldos y congelamiento de precios; Tablero Kanban táctil con 4 estados; Catálogo de productos con alérgenos y disponibilidad; Agenda de clientes con notas y vinculación automática (**HU-02**); Dashboard con recordatorios automáticos por fecha (*Hoy, Mañana, 3 días*); Reportes de ventas periódicos; Autenticación preparada (RBAC) y persistencia en SQLite nativo.
  - *Excluido:* Control de stock de materias primas (harina, huevos), pasarela de pagos automatizada con tarjeta y tienda pública de autogestión para clientes.
- **Solución Implementada:** Una Single Page Application (SPA) construida en React 19 y Vite, conectada a una API REST en Node.js 24 y Express, respaldada por una base de datos relacional SQLite 3 mediante `node:sqlite`. La interfaz responde al concepto *mobile-first*, con botones táctiles de 44px mínimo y una paleta cálida (#FFF9F4, #F8E8E5, #B66C70, #79534A).

---

## B. Plan de Trabajo
El proyecto se estructuró en 5 etapas secuenciales abarcando 12 tareas (T01 a T12):
1. **Etapa 1: Cimientos y Persistencia**
   - *T01 (Esqueleto Base):* Configuración de carpetas desacopladas, Express, Vite, scripts y healthcheck.
   - *T02 (Base de Datos):* Esquema DDL en SQLite, índices, claves foráneas y semillas de datos.
2. **Etapa 2: Entidades Maestras**
   - *T03 (Catálogo):* CRUD de productos, categorías, alérgenos y conmutador de disponibilidad.
   - *T04 (Clientes):* Agenda de habituales con alergias, soft-delete y vinculación automática HU-02.
3. **Etapa 3: Operativa y Flujo Visual**
   - *T05 (Pedidos):* Cálculo financiero, seña/saldo, congelamiento de precio y bloqueo fuera de Pendiente.
   - *T06 (Kanban):* 4 columnas táctiles con select, timestamp de entrega y diálogo de reapertura.
4. **Etapa 4: Visibilidad y Métricas**
   - *T07 (Dashboard y Recordatorios):* Resumen mensual en vivo y alertas automáticas por fecha.
   - *T08 (Reportes):* Filtros por día, semana, mes y año con ranking visual de más vendidos.
5. **Etapa 5: Calidad, Seguridad y Despliegue**
   - *T09 (Testing Integral E2E):* Ciclo de vida completo probado sin mockeos.
   - *T10 (Autenticación y RBAC):* Middleware modular, endpoint `/api/auth/me` y roles.
   - *T11 (Configuración de Despliegue):* API dinámica, build de producción y CORS estricto.
   - *T12 (Documentación Oficial):* README, documentación en `docs/` y archivos en raíz.

---

## C. Justificación del Orden de Tareas
El orden de construcción respondió a dependencias técnicas reales y minimización de riesgos:
1. **Base de Datos antes que Lógica:** No se puede construir un módulo de pedidos si no existe el esquema relacional con restricciones de clave foránea e integridad financiera.
2. **Entidades Maestras antes que Transacciones:** Un pedido no puede existir sin productos del catálogo ni clientes a los cuales facturar.
3. **Núcleo de Negocio antes que Vistas de Resumen:** El Dashboard (T07) y los Reportes (T08) dependen de pedidos reales con estados consolidados (T05 y T06); desarrollarlos antes habría obligado a usar datos simulados descartables.
4. **Validación E2E antes del Despliegue:** La integración completa (T09) se realizó antes de empaquetar para producción (T11) para garantizar que ninguna regla de negocio estuviera rota.

---

## D. Plan de Pruebas y Resultados Reales
- **Estrategia:** Pruebas unitarias, de integración y reglas de negocio automatizadas utilizando el runner nativo `node:test` y aserciones `node:assert`.
- **Casos Evaluados:**
  - Integridad de saldos ($\text{Total} = \text{Seña} + \text{Saldo Pendiente}$).
  - Rechazo de fechas en el pasado ($\text{delivery\_date} \ge \text{today}$).
  - Rechazo de señas mayores al total del pedido.
  - Bloqueo estricto de edición cuando el pedido no está en `Pendiente`.
  - Vinculación automática HU-02 de pedidos previos por número de teléfono.
  - Pausado automático de productos con historial ante intentos de borrado físico.
  - Confirmación y limpieza de timestamp en reaperturas de pedidos entregados.
- **Resultados Reales Obtenidos:**
  - **10 suites de prueba ejecutadas.**
  - **44 pruebas automatizadas pasando con éxito (100% pass, 0 fallos).**
  - **Tiempo total de ejecución:** ~7.1 segundos.
- **Errores Encontrados y Correcciones:**
  1. *Fallo de better-sqlite3:* Imposibilidad de compilar bindings C++. **Corrección:** Migración a `node:sqlite` nativo.
  2. *Bloqueo de base de datos en tests:* "Database is locked" por tests concurrentes. **Corrección:** Fijar `--test-concurrency=1` y modo WAL.
  3. *Acumulación de datos de prueba:* Las pruebas ensuciaban la base de datos de desarrollo. **Corrección:** Aislamiento en `carolina_sweet_test.db` durante la ejecución de tests.

---

## E. Implementación Técnica y Estado de Funcionalidades
- **Arquitectura:** Cliente SPA (React) + API REST (Node.js/Express) + Base de datos relacional (SQLite 3).
- **Tecnologías Empleadas:** Node.js 24, Express 4, `node:sqlite`, React 19, Vite, Lucide-react, Vanilla CSS con variables de diseño.
- **Funcionalidades 100% Terminadas:**
  - [x] Panel de inicio con métricas de facturación y próximas entregas.
  - [x] Recordatorios automáticos clasificados en Hoy, Mañana y Próximos 3 días.
  - [x] Tablero Kanban con selectores táctiles para celulares.
  - [x] Catálogo con alérgenos, fotos y conmutador de disponibilidad.
  - [x] Agenda de clientes con detección de alergias y regla HU-02.
  - [x] Reportes periódicos (día, semana, mes, año) y ranking de más vendidos.
  - [x] CORS configurado para orígenes autorizados específicos.
  - [x] Middleware de autenticación y roles preparado.
- **Funcionalidades Pendientes (Fase 2):**
  - [ ] Integración con API de WhatsApp para notificación automática al cliente cuando su pedido esté en "Listo".
  - [ ] Pasarela de cobros en línea para señas mediante enlace de pago.

---

## F. Conclusiones y Aprendizajes
- **Resultados:** Se obtuvo una solución robusta, intuitiva y visualmente adaptada a la identidad artesanal de Carolina Sweet, eliminando el uso de cuadernos y el riesgo sanitario en alérgenos.
- **Aprendizajes:** La adopción temprana de APIs nativas modernas (`node:sqlite`, `node:test`) redujo drásticamente las dependencias externas y facilitó un entorno de desarrollo libre de fallos de compilación. El enfoque mobile-first desde el día uno aseguró que la aplicación sea realmente usable en la cocina.
- **Limitaciones Actuales:** En hosting gratuitos sin almacenamiento persistente, la base de datos SQLite se reinicia a las semillas por defecto si el contenedor se apaga; para producción comercial se recomienda montar un disco persistente en Render o conectar una base PostgreSQL externa.
