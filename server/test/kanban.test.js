const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const { db } = require('../src/database/db');

describe('Módulo Kanban y Transiciones de Estado (API)', () => {
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

  test('PATCH /api/orders/:id/status actualiza de Pendiente a En preparación', async () => {
    const res = await fetch(`${baseUrl}/orders/1/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'En preparación' })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.data.status, 'En preparación');
  });

  test('PATCH /api/orders/:id/status a "Entregado" registra delivered_at', async () => {
    const res = await fetch(`${baseUrl}/orders/1/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Entregado' })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.data.status, 'Entregado');
    assert.ok(body.data.delivered_at !== null);
  });

  test('Reapertura permitida: Cambiar de Entregado a En preparación para corrección limpia delivered_at', async () => {
    const res = await fetch(`${baseUrl}/orders/1/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'En preparación' })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.data.status, 'En preparación');
    assert.strictEqual(body.data.delivered_at, null);

    // Dejarlo nuevamente en Pendiente para no afectar tests futuros
    await fetch(`${baseUrl}/orders/1/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Pendiente' })
    });
  });

  test('PATCH /api/orders/:id/status rechaza estados no permitidos', async () => {
    const res = await fetch(`${baseUrl}/orders/1/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'EstadoInventado' })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 400);
    assert.ok(body.error.includes('Estado inválido'));
  });

  test('POST /api/orders/cleanup-cancelled depura pedidos cancelados con más de 365 días', async () => {
    // Insertar un pedido cancelado hace 400 días
    const insertOld = db.prepare(`
      INSERT INTO orders (
        status, delivery_date, total_price, deposit_paid, balance_pending, cancelled_at
      )
      VALUES ('Cancelado', '2025-01-01', 10000, 0, 10000, datetime('now', '-400 days'))
    `);
    insertOld.run();

    const res = await fetch(`${baseUrl}/orders/cleanup-cancelled`, {
      method: 'POST'
    });
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(body.cleaned_orders >= 1);
  });
});
