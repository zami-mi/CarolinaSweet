# Requisitos No Funcionales: Carolina Sweet

Los requisitos no funcionales definen los atributos de calidad, rendimiento, seguridad, diseño y arquitectura operativa del sistema.

---

## 1: Rendimiento y Eficiencia
- **Tiempo de respuesta:** Las consultas de API y lectura de pedidos deben responder en menos de 200 milisegundos en condiciones normales.
- **Base de datos ágil:** Empleo de **SQLite nativo (`node:sqlite`)** en modo **WAL (*Write-Ahead Logging*)** para permitir lecturas y escrituras concurrentes rápidas sin bloqueos.
- **Empaquetado ligero:** Compilación del cliente con **Vite**, logrando tiempos de carga de la aplicación en menos de 1 segundo en conexiones estándar.

---

## 2: Usabilidad y Ergonomía Mobile-First
- **Diseño pensado para celular:** La interfaz prioriza el uso en pantallas móviles táctiles (< 600px), asegurando áreas táctiles de al menos 44x44 píxeles para dedos en movimiento o con harina en el taller.
- **Sin arrastre forzado (*No Drag & Drop*):** Se reemplazó el arrastre accidental del Kanban por menús `<select>` accesibles y predecibles.
- **Paleta artesanal acogedora:**
  - `#FFF9F4` (Fondo blanco harina)
  - `#F8E8E5` (Rosa suave pastelero)
  - `#B66C70` (Rosa artesanal de acento)
  - `#79534A` (Marrón chocolate de contraste)
  - `#4F403B` (Texto de alta legibilidad)

---

## 3: Seguridad y Preparación de Roles (RBAC)
- **Sanitización de entradas:** Validación estricta en el servidor para evitar inyecciones SQL o datos inconsistentes (precios negativos, señas mayores al total).
- **Control de acceso preparado:** Middleware de autenticación modular que permite alternar entre:
  - *Modo Abierto:* Desarrollo y uso ágil local con usuario administrador inyectado automáticamente.
  - *Modo Seguro:* Exigencia de token Bearer con `AUTH_REQUIRED=true` y verificación de roles (`admin`, `employee`).
- **Restricción de CORS:** Soporte de CORS configurable para permitir comunicación segura entre cliente y servidor.

---

## 4: Confiabilidad e Integridad de Datos
- **Restricciones de base de datos:** Integridad referencial mediante claves foráneas activas (`PRAGMA foreign_keys = ON;`), claves únicas (`phone`) y restricciones `CHECK`.
- **Persistencia atómica:** Manejo transaccional en la creación de pedidos (`orders` + `order_items`) para evitar pedidos huérfanos.
- **Preservación contable:** El borrado de clientes y productos con historial se transforma en desactivación lógica para nunca romper los datos históricos.

---

## 5: Mantenibilidad y Arquitectura Limpia
- **Separación de capas:** Desacoplamiento estricto entre UI (React), rutas, controladores, lógica de negocio y persistencia.
- **Cero dependencias C++:** Uso de librerías JavaScript puras y módulos nativos de Node.js (evitando problemas de compilación en Windows/Linux).
- **Cobertura de pruebas:** Suite automatizada con `node:test` que cubre el 100% de los casos de uso críticos.
