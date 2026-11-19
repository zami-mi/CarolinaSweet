/**
 * Middleware de Autenticación y Control de Roles (RBAC)
 * =====================================================
 * En la fase actual de Carolina Sweet, la aplicación opera en modo "artesanal/abierto"
 * para máxima agilidad de uso en el taller sin necesidad de login constante.
 * 
 * Este middleware ya deja preparada la arquitectura completa para cuando se active
 * la autenticación por JWT o sesión:
 * 
 * 1. Simulación automática de usuario activo (Carolina - admin) en modo desarrollo/sin auth.
 * 2. Bloqueo 401 si se activa `AUTH_REQUIRED=true` y no se envía token.
 * 3. Control de acceso granular por roles (`admin`, `employee`) con respuesta 403.
 */

const { db } = require('../database/db');

// Bandera configurable por variable de entorno (por defecto 'false' para uso inmediato sin login)
const AUTH_REQUIRED = process.env.AUTH_REQUIRED === 'true';

/**
 * Middleware principal de verificación de identidad.
 * Si AUTH_REQUIRED es false, adjunta al usuario admin por defecto y permite el paso.
 */
function authenticate(req, res, next) {
  // Modo sin autenticación obligatoria (Fase actual)
  if (!AUTH_REQUIRED) {
    req.user = {
      id: 1,
      username: 'carolina',
      role: 'admin'
    };
    return next();
  }

  // Modo con autenticación obligatoria (Fase futura con JWT)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Acceso no autorizado: Se requiere un token Bearer en el encabezado Authorization.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // NOTA PEDAGÓGICA PARA FASE 2:
    // Aquí se reemplazaría por: const decoded = jwt.verify(token, JWT_SECRET);
    // Para validación base con SQLite:
    if (token === 'demo-token-carolina-admin') {
      req.user = { id: 1, username: 'carolina', role: 'admin' };
      return next();
    } else if (token === 'demo-token-empleado') {
      req.user = { id: 2, username: 'ayudante', role: 'employee' };
      return next();
    }

    return res.status(401).json({
      error: 'Token inválido o expirado.'
    });
  } catch (error) {
    return res.status(401).json({
      error: 'Error al verificar las credenciales de acceso.'
    });
  }
}

/**
 * Middleware de autorización basado en roles (RBAC).
 * Permite restringir endpoints específicos según el rol del usuario autenticado.
 * @param {string[]} roles - Array de roles permitidos (ej. ['admin'])
 */
function requireRole(roles = ['admin']) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'No se encontró información de usuario autenticado.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Acceso denegado: Se requiere uno de los siguientes roles: ${roles.join(', ')}.`
      });
    }

    next();
  };
}

module.exports = {
  authenticate,
  requireRole,
  AUTH_REQUIRED
};
