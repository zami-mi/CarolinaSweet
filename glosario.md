# Glosario de Términos y Conceptos — Carolina Sweet

Este glosario define los términos del negocio, conceptos técnicos y convenciones utilizadas en toda la documentación del sistema **Carolina Sweet**.

---

## 1. Términos del Negocio de Pastelería

- **Pastelería Artesanal:** Elaboración de creaciones dulces bajo pedido, utilizando ingredientes de calidad, técnicas tradicionales y personalización según las preferencias de cada cliente.
- **Cliente Habitual:** Cliente registrado formalmente en la agenda con ficha propia, teléfono único, notas de gustos estéticos y registro de alergias alimentarias.
- **Cliente Ocasional:** Cliente que realiza un encargo rápido (generalmente por WhatsApp o de paso) sin estar registrado previamente. Se identifican por su nombre y teléfono en el pedido.
- **HU-02 (Vinculación Automática):** Regla de negocio que asocia automáticamente los pedidos históricos de un cliente ocasional a su nueva ficha cuando se lo registra como habitual con ese mismo teléfono.
- **Adicionales Personalizados:** Conceptos extra agregados a un pedido con costo propio (ej. *Topper temático de 15 años, velas artesanales, bengalas doradas, flores naturales*).
- **Seña / Anticipo:** Monto de dinero abonado por el cliente por adelantado al momento de encargar el pedido para asegurar la reserva y cubrir el costo inicial de insumos.
- **Saldo Pendiente:** Diferencia económica restante que el cliente debe saldar al momento de retirar o recibir el pedido ($\text{Total} - \text{Seña}$).
- **Congelamiento de Precios:** Fijación inmutable del precio unitario de un producto en el momento exacto en que se confirma el pedido, protegiendo el importe ante futuros cambios de precio en el catálogo.
- **Alérgenos:** Sustancias presentes en los alimentos que pueden provocar reacciones adversas o de salud en personas sensibles (ej. *Gluten/TACC, Lácteos, Huevos, Frutos secos, Soja*).
- **Tablero Kanban:** Herramienta visual de gestión del flujo de trabajo organizada en columnas que representan las etapas de elaboración: *Pendiente*, *En preparación*, *Listo* y *Entregado*.

---

## 2. Conceptos Técnicos y Arquitectura

- **Mobile-First:** Enfoque de diseño y desarrollo web que diseña la interfaz y la ergonomía táctil priorizando las pantallas de dispositivos móviles antes de adaptar a computadoras de escritorio.
- **SPA (Single Page Application):** Aplicación web (desarrollada con React y Vite) que carga una sola página HTML y actualiza dinámicamente el contenido sin recargar el navegador.
- **API REST (Representational State Transfer):** Interfaz de comunicación entre el frontend y el backend que utiliza métodos HTTP estándar (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) e intercambia datos en formato JSON.
- **`node:sqlite`:** Módulo síncrono nativo introducido en Node.js (v22/v24) para operar bases de datos SQLite 3 de alto rendimiento sin requerir compiladores nativos C++.
- **Modo WAL (Write-Ahead Logging):** Modo de operación en SQLite que escribe los cambios en un archivo de registro previo, permitiendo lecturas concurrentes simultáneas mientras se escribe.
- **Soft-Delete (Baja Lógica):** Técnica donde los registros no se borran físicamente de la base de datos (con `DELETE`), sino que se marcan como inactivos (`is_active = 0` o `is_available = 0`) para preservar la integridad del historial contable.
- **RBAC (Role-Based Access Control):** Control de acceso basado en roles que asigna permisos específicos según el rol del usuario autenticado (ej. `admin` vs `employee`).
- **Seed (Semillas):** Datos iniciales predeterminados (categorías, creaciones del catálogo, clientes y pedidos de muestra) que se cargan automáticamente al iniciar la base de datos vacía.
- **Pruebas E2E (End-to-End):** Pruebas de integración automatizadas que validan el ciclo de vida completo de una operación de punta a punta simulando el comportamiento real del usuario.
- **ADR (Architectural Decision Record):** Documento que describe una decisión arquitectónica relevante tomada en el proyecto, su justificación y sus alternativas evaluadas.
