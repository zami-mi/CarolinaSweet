# Guía de Despliegue en la Nube: Carolina Sweet

Instrucciones paso a paso para publicar y mantener la aplicación en plataformas PaaS como **Render** o **Railway**.

---

## 1. Estrategias de Despliegue Disponibles

### Estrategia A: Despliegue Unificado (Un solo Web Service - Recomendado)
Express está preparado para servir la API REST en `/api/*` y la SPA de React compilada en `/`:
1. **Crear Web Service en Render:**
   - Repositorio: Conectar con el repositorio de GitHub.
   - Entorno: Node.js.
   - **Build Command:**
     ```bash
     npm run install:all && npm run build
     ```
   - **Start Command:**
     ```bash
     npm run start
     ```
   - **Variables de Entorno:**
     - `NODE_ENV=production`
     - `PORT=4000` (o la que asigne Render)

---

### Estrategia B: Despliegue Desacoplado (API + Static Site)
1. **Backend (Web Service):**
   - Carpeta raíz: `server`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - URL generada (ejemplo): `https://carolina-sweet-api.onrender.com`
2. **Frontend (Static Site):**
   - Carpeta raíz: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Variable de Entorno:
     - `VITE_API_URL=https://carolina-sweet-api.onrender.com/api`

---

## 2. Persistencia en SQLite en Servidores Efímeros
En plataformas gratuitas con sistemas de archivos efímeros (como Render Free), el archivo de base de datos se recrea tras un reinicio.
- **Ventaja de Carolina Sweet:** El servidor ejecuta automáticamente `runSeed()` al arrancar si la base de datos está vacía, asegurando que la pastelería siempre cuente con sus categorías, productos iniciales y clientes de muestra disponibles de inmediato.
- **Para producción con persistencia absoluta:** Se recomienda vincular un **Render Disk** montado en `/data` y configurar la variable de entorno:
  ```text
  DB_PATH=/data/carolina_sweet.db
  ```
