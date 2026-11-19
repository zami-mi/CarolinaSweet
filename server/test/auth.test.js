const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const { authenticate, requireRole } = require('../src/middlewares/auth.middleware');

describe('T10 – Preparación de Autenticación y RBAC', () => {
  let server;
  let baseUrl;

  before(async () => {
    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}/api`;
  });

  after(() => {
    server.close();
  });

  test('GET /api/auth/me devuelve el usuario activo por defecto y estado de autenticación', async () => {
    const res = await fetch(`${baseUrl}/auth/me`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(body.user !== undefined);
    assert.strictEqual(body.user.username, 'carolina');
    assert.strictEqual(body.user.role, 'admin');
    assert.strictEqual(typeof body.auth_enabled, 'boolean');
  });

  test('Middleware requireRole permite el paso cuando el rol coincide', () => {
    const req = { user: { id: 1, role: 'admin' } };
    let statusCalled = null;
    let jsonSent = null;
    let nextCalled = false;

    const res = {
      status: (code) => { statusCalled = code; return res; },
      json: (data) => { jsonSent = data; return res; }
    };

    const middleware = requireRole(['admin']);
    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(statusCalled, null);
  });

  test('Middleware requireRole bloquea con 403 cuando el rol no tiene permisos', () => {
    const req = { user: { id: 2, role: 'employee' } };
    let statusCalled = null;
    let jsonSent = null;
    let nextCalled = false;

    const res = {
      status: (code) => { statusCalled = code; return res; },
      json: (data) => { jsonSent = data; return res; }
    };

    const middleware = requireRole(['admin']);
    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(statusCalled, 403);
    assert.ok(jsonSent.error.includes('Acceso denegado'));
  });

  test('Middleware requireRole bloquea con 401 si req.user no existe', () => {
    const req = {};
    let statusCalled = null;
    let jsonSent = null;

    const res = {
      status: (code) => { statusCalled = code; return res; },
      json: (data) => { jsonSent = data; return res; }
    };

    const middleware = requireRole(['admin']);
    middleware(req, res, () => {});

    assert.strictEqual(statusCalled, 401);
  });
});
