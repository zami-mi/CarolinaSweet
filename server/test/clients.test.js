const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const { db } = require('../src/database/db');

describe('Módulo de Clientes (API)', () => {
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

  test('GET /api/clients retorna lista de clientes activos', async () => {
    const res = await fetch(`${baseUrl}/clients`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 3);
    assert.ok(body.data.every(c => c.is_active === 1));
  });

  test('POST /api/clients valida teléfono duplicado', async () => {
    const res = await fetch(`${baseUrl}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Martina Duplicada',
        phone: '1123456789' // Teléfono existente en los seeds
      })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 400);
    assert.ok(body.error.includes('Ya existe un cliente'));
  });

  test('HU-02: Registrar cliente habitual vincula automáticamente pedidos previos de ocasionales con ese teléfono', async () => {
    // Generar teléfono único para idempotencia del test
    const testPhone = '11' + Math.floor(10000000 + Math.random() * 90000000);

    // 1. Simular un pedido ocasional previo con ese teléfono
    const insertOccasionalOrder = db.prepare(`
      INSERT INTO orders (
        client_id, occasional_name, occasional_phone, status, delivery_date, total_price, deposit_paid, balance_pending
      )
      VALUES (NULL, 'Valeria Ocasional', ?, 'Entregado', '2026-11-10', 20000, 20000, 0)
    `);
    const orderResult = insertOccasionalOrder.run(testPhone);
    const orderId = orderResult.lastInsertRowid;

    // 2. Ahora Valeria se registra formalmente como habitual
    const res = await fetch(`${baseUrl}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Valeria Habitual',
        phone: testPhone,
        notes: 'Le encanta el dulce de leche',
        allergies: 'Celiaquía'
      })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 201);
    const newClientId = body.data.id;

    // 3. Verificar que el pedido previo ahora esté vinculado al client_id y se limpiaron los campos ocasionales
    const linkedOrder = db.prepare('SELECT client_id, occasional_name, occasional_phone FROM orders WHERE id = ?').get(orderId);
    assert.strictEqual(linkedOrder.client_id, newClientId);
    assert.strictEqual(linkedOrder.occasional_name, null);
    assert.strictEqual(linkedOrder.occasional_phone, null);
  });

  test('GET /api/clients/:id retorna historial de pedidos del cliente', async () => {
    // El cliente 1 (Martina López) tiene pedidos en los seeds
    const res = await fetch(`${baseUrl}/clients/1`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.data.id, 1);
    assert.ok(Array.isArray(body.data.orders));
    assert.ok(body.data.orders.length >= 1);
  });

  test('PATCH /api/clients/:id/status permite desactivación (soft delete) y reactivación', async () => {
    // Desactivar cliente 2
    const deactRes = await fetch(`${baseUrl}/clients/2/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: 0 })
    });
    const deactBody = await deactRes.json();

    assert.strictEqual(deactRes.status, 200);
    assert.strictEqual(deactBody.data.is_active, 0);

    // Verificar que no figure en la lista por defecto
    const listRes = await fetch(`${baseUrl}/clients`);
    const { data: clients } = await listRes.json();
    assert.ok(!clients.some(c => c.id === 2));

    // Reactivar cliente 2
    const reactRes = await fetch(`${baseUrl}/clients/2/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: 1 })
    });
    const reactBody = await reactRes.json();

    assert.strictEqual(reactRes.status, 200);
    assert.strictEqual(reactBody.data.is_active, 1);
  });
});
