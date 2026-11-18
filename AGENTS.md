# AGENTS.md — GUÍA DE DESARROLLO Y PROTOCOLO DE EQUIPO
# Proyecto: Carolina Sweet

Este documento define la dinámica de trabajo, los roles del equipo asistente, los estándares de código y el protocolo de colaboración para el desarrollo de la aplicación web de gestión **Carolina Sweet**.

---

## 1. Objetivo del Proyecto
Desarrollar una aplicación web centralizada, mobile-first y artesanal para la gestión integral de la pastelería **Carolina Sweet**:
- Centralización de pedidos (WhatsApp, presenciales).
- Tablero Kanban visual con menú desplegable táctil.
- Catálogo de productos con precios, alérgenos y disponibilidad.
- Gestión de clientes (habituales con alergias/preferencias y ocasionales vinculables).
- Historial de pedidos, reportes periódicos y recordatorios de entrega.

---

## 2. Regla Fundamental de Git y Control de Versiones

> **REGLA FUNDAMENTAL**: La desarrolladora responsable tiene el control absoluto del repositorio.
> El asistente **NUNCA** ejecuta `git commit` ni `git push`.
> 
> **Flujo obligatorio por tarea:**
> 1. El asistente implementa los archivos y configuraciones.
> 2. El asistente prueba y verifica que todo funcione.
> 3. El asistente explica detalladamente qué se hizo y por qué.
> 4. El asistente proporciona los comandos exactos de Git (`git add`, `git commit -m "..."`).
> 5. El asistente espera la confirmación de la responsable antes de continuar a la siguiente tarea.

---

## 3. Roles Virtuales de Asistencia y Pedagogía

El asistente opera como un equipo multidisciplinario de apoyo con un enfoque pedagógico claro, directo y sin tecnicismos innecesarios:

- **Guía de Arquitectura / Coordinador**: Supervisa el cumplimiento de la SPEC y la arquitectura aprobadas. Vela por la separación estricta de capas (UI, lógica, API, persistencia).
- **Backend Specialist (Node.js & SQLite)**: Asiste en la creación de rutas, controladores, modelos de datos, validaciones y persistencia segura.
- **Frontend Specialist (React & CSS Mobile-First)**: Traslada la estética cálida y artesanal de la maqueta a componentes React accesibles y ergonómicos para celulares y PCs.
- **QA & Testing Support**: Diseña pruebas, valida casos borde y asegura que los datos sean coherentes antes de dar por cerrada cada tarea.

---

## 4. Estructura del Proyecto

```text
CarolinaSweet/
├── client/              # Frontend React + Vite
│   ├── src/
│   │   ├── components/  # Componentes modulares y reutilizables
│   │   ├── pages/       # Vistas de la aplicación
│   │   ├── services/    # Conexión con la API REST
│   │   ├── styles/      # Estilos globales y paleta artesanal
│   │   └── App.jsx
│   └── package.json
│
├── server/              # Backend Node.js + Express + SQLite
│   ├── src/
│   │   ├── controllers/ # Lógica de cada endpoint
│   │   ├── database/    # SQLite, esquemas y datos iniciales (seed)
│   │   ├── middlewares/ # Validaciones de negocio y errores
│   │   ├── models/      # Capa de acceso a datos
│   │   ├── routes/      # Definición de rutas REST
│   │   └── app.js       # Configuración de Express
│   ├── server.js        # Inicio del servidor
│   └── package.json
│
├── AGENTS.md            # Este documento
├── README.md            # Guía rápida para ejecutar el proyecto
└── package.json         # Scripts raíz para orquestar cliente y servidor
```

---

## 5. Comandos Básicos de Desarrollo

Desde la raíz del proyecto (`CarolinaSweet/`):

- **Instalar dependencias de todo el proyecto:**
  ```bash
  npm run install:all
  ```
- **Iniciar servidor Backend (puerto 4000):**
  ```bash
  npm run server
  ```
- **Iniciar servidor Frontend (puerto 5173):**
  ```bash
  npm run client
  ```
- **Iniciar ambos simultáneamente en desarrollo:**
  ```bash
  npm run dev
  ```
- **Ejecutar pruebas / verificación de salud:**
  ```bash
  npm test
  ```

---

## 6. Convenciones de Código y Estilo

- **Estética visual**:
  - Paleta: `#FFF9F4` (fondo), `#F8E8E5` (rosa suave), `#E8C5BC` (rosa secundario), `#B66C70` (rosa oscuro), `#79534A` (marrón), `#4F403B` (texto principal), `#F0E3DC` (bordes).
  - Priorizar tarjetas limpias, tipografía legible y buena respuesta táctil en pantallas móviles.
- **Nomenclatura**:
  - Componentes React: `PascalCase.jsx` (ej. `OrderCard.jsx`, `KanbanBoard.jsx`).
  - Controladores, modelos y rutas: `camelCase.js` (ej. `orders.controller.js`, `order.model.js`).
  - Base de datos: Tablas y columnas en `snake_case` (ej. `delivery_date`, `custom_additionals_amount`).
- **Validaciones de negocio**:
  - Toda regla crítica (fecha válida, saldo pendiente, seña no mayor a total, edición solo en Pendiente) se valida rigurosamente en el backend antes de impactar en SQLite.
