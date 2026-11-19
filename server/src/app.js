const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const categoriesRoutes = require('./routes/categories.routes');
const productsRoutes = require('./routes/products.routes');
const clientsRoutes = require('./routes/clients.routes');
const ordersRoutes = require('./routes/orders.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const reportsRoutes   = require('./routes/reports.routes');
const { authenticate } = require('./middlewares/auth.middleware');

const app = express();

// Configuración estricta de CORS (Punto 13)
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: El origen '${origin}' no está autorizado.`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middlewares globales
app.use(cors(corsOptions));
app.use(express.json());
app.use(authenticate);

// Endpoint de verificación de salud (Health check)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Carolina Sweet API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Endpoint de perfil y estado de autenticación (Arquitectura futura)
app.get('/api/auth/me', (req, res) => {
  res.json({
    user: req.user,
    auth_enabled: process.env.AUTH_REQUIRED === 'true'
  });
});

// Rutas de la API REST
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports',   reportsRoutes);

// Servir frontend compilado en producción si existe
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

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
