# 🍰 Carolina Sweet — Sistema de Gestión para Pastelería Artesanal

Aplicación web centralizada, mobile-first y de estética cálida y artesanal, diseñada para la gestión integral de pedidos, catálogo de creaciones, agenda de clientes y reportes de la pastelería **Carolina Sweet**.

---

## ✨ Características Principales

- **Panel de Inicio y Recordatorios Inteligentes:**
  - Métricas en vivo del mes (facturación de entregados, pedidos pendientes y próximas entregas).
  - Alertas automáticas clasificadas en **Hoy**, **Mañana** y **Próximos 3 días** (sin botones de descarte manual: se actualizan en tiempo real al cambiar el estado del pedido).
  - Listado de pedidos recientes y accesos directos de carga rápida.

- **Tablero Kanban y Gestión de Pedidos:**
  - 4 columnas visuales: **Pendiente**, **En preparación**, **Listo** y **Entregado**.
  - Selector táctil ergonómico (`<select>`) diseñado para evitar errores de arrastre accidental en pantallas táctiles o celulares con harina.
  - Vista dual alternable: **Tablero Kanban** o **Tabla / Lista detallada**.
  - Congelamiento histórico de precios al momento de confirmar el pedido.
  - Validación estricta: solo se permite editar pedidos en estado **Pendiente**.
  - Modal de confirmación al reabrir pedidos entregados para correcciones.
  - Acciones rápidas: duplicar pedido para nuevas fechas y conmutar pedidos favoritos con estrella.
  - Depuración automática de pedidos cancelados con más de 365 días.

- **Catálogo de Creaciones:**
  - Clasificación por categorías (Tortas artesanales, Cupcakes, Cheesecakes, Boxes dulces).
  - Registro de alérgenos, precios base y destacados.
  - Conmutador táctil de disponibilidad (Disponible / Pausado).
  - Protección de borrado: si un producto tiene pedidos históricos, se pausa automáticamente para preservar la integridad financiera.

- **Agenda de Clientes (HU-02):**
  - Registro de clientes habituales con seguimiento de alergias (ej. Celíacos, frutos secos) y preferencias estéticas.
  - **Vinculación automática (HU-02):** Al registrar a un nuevo cliente habitual, el sistema busca y asocia de inmediato pedidos anteriores realizados como cliente ocasional mediante su número de teléfono.
  - Desactivación suave (*soft delete*) y reactivación sin pérdida de historial.

- **Reportes Periódicos y Métricas de Ventas:**
  - Filtros temporales: **Hoy**, **Esta Semana**, **Este Mes** y **Este Año**.
  - Total facturado de pedidos entregados, cantidad de pedidos y ticket promedio.
  - Ranking visual de los 5 productos más vendidos con barras proporcionales.
  - Distribución de pedidos según su estado en el período seleccionado.

- **Preparación de Autenticación y Control de Roles (RBAC):**
  - Diseñado inicialmente en modo taller ágil (acceso directo sin bloqueos de login).
  - Middleware preparado para activar autenticación por JWT (`AUTH_REQUIRED=true`) y control de roles (`admin`, `employee`).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 19, Vite, Lucide React, CSS Moderno Mobile-First |
| **Backend** | Node.js (v24), Express |
| **Base de Datos** | SQLite mediante el módulo nativo `node:sqlite` (Node 24+) |
| **Testing** | Runner nativo `node:test` y aserciones `node:assert` (44 tests automatizados) |

---

## 📋 Requisitos Previos

- **Node.js**: Versión 22 o superior (Recomendado: Node.js 24).
- **npm**: Versión 10 o superior.
- *Nota:* No requiere compiladores externos de C++ ni Visual Studio Build Tools, ya que utiliza el motor SQLite integrado nativo de Node.js.

---

## 🚀 Instalación y Puesta en Marcha

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd CarolinaSweet
   ```

2. **Instalar dependencias de todo el proyecto (raíz, backend y frontend):**
   ```bash
   npm run install:all
   ```

3. **Iniciar en entorno de desarrollo (Backend en :4000 y Frontend en :5173):**
   ```bash
   npm run dev
   ```
   Abre tu navegador en [http://localhost:5173](http://localhost:5173).

---

## 🧪 Ejecución de Pruebas Automatizadas

El proyecto cuenta con una cobertura integral de pruebas unitarias, de integración y reglas de negocio:

```bash
npm test
```

> **Resultado actual:** **44 pruebas pasando** en 10 suites (Base de datos, Catálogo, Clientes, Pedidos, Kanban, Dashboard, Reportes, Ciclo de Vida E2E, Autenticación y Health Check).

---

## 📦 Scripts Disponibles

- `npm run dev`: Ejecuta servidor y cliente simultáneamente en desarrollo.
- `npm run server`: Inicia únicamente el servidor backend (`localhost:4000`).
- `npm run client`: Inicia únicamente el servidor frontend con Vite (`localhost:5173`).
- `npm run build`: Compila los archivos del frontend para producción en `client/dist`.
- `npm run start`: Inicia el servidor backend en modo producción.
- `npm test`: Ejecuta la suite de pruebas del backend.

---

## 🌐 Guía de Despliegue en la Nube (Render / Railway)

### Opción A: Despliegue Unificado (Un solo Web Service)
1. Conectar el repositorio en Render o Railway.
2. **Build Command:** `npm run install:all && npm run build`
3. **Start Command:** `npm run start`
4. Express servirá la API REST en `/api/*` y la aplicación React compilada en la raíz `/`.

### Opción B: Despliegue Separado (Web Service + Static Site)
1. **Backend (Web Service en Render):**
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `node server.js`
   - Variable de entorno: `PORT=4000` (o la que asigne la plataforma).
2. **Frontend (Static Site en Render):**
   - Root directory: `client`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Variable de entorno: `VITE_API_URL=https://tu-backend.onrender.com/api`

---

## 🎨 Paleta de Colores Artesanal

| Color | Código Hex | Uso principal |
|---|---|---|
| Blanco Harina | `#FFF9F4` | Fondo de la aplicación |
| Rosa Suave | `#F8E8E5` | Fondo de tarjetas y contenedores |
| Rosa Secundario | `#E8C5BC` | Bordes suaves e insignias |
| Rosa Artesanal | `#B66C70` | Botones de acción, enlaces y acentos |
| Marrón Pastelero | `#79534A` | Títulos, encabezados y destacados |
| Chocolate Oscuro | `#4F403B` | Tipografía principal y lectura |
| Borde Taller | `#F0E3DC` | Separadores y líneas divisorias |

---

## 👩‍🍳 Protocolo de Colaboración

El desarrollo de este proyecto sigue estrictamente el protocolo definido en [AGENTS.md](file:///c:/Users/PC%20VIP/Documents/CarolinaSweet/AGENTS.md). 
La desarrolladora responsable mantiene el control absoluto de cada confirmación de versión en Git.

*Carolina Sweet © 2026 — Hecho con cariño ♡*
