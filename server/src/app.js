const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Endpoint de verificación de salud (Health check)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Carolina Sweet API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Manejador para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejador centralizado de errores (500)
app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

module.exports = app;
