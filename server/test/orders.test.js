const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const { db } = require('../src/database/db');

describe('Módulo de Pedidos (API)', () => {
  let server;
  let baseUrl;
  const todayStr = new Date().toISOString().split('T')[0];

  before(async () => {
    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}/api`;
  });

  after(() => {
    server.close();
  });

  test('GET /api/orders retorna lista de pedidos', async () => {
    const res = await fetch(`${baseUrl}/orders`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 4);
    assert.ok(body.data[0].total_price !== undefined);
  });

  test('POST /api/orders crea un pedido válido con cliente habitual y calcula saldo', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: 1,
        delivery_date: todayStr,
        delivery_time: '18:00',
        customer_notes: 'Sin azúcar refinada en la cobertura',
        custom_additionals_concept: 'Velas doradas y bengala',
        custom_additionals_amount: 1500,
        deposit_paid: 10000,
        items: [
          { product_id: 1, quantity: 1 } // Torta de chocolate base_price: 28000
        ]
      })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.data.client_id, 1);
    assert.strictEqual(body.data.status, 'Pendiente');
    assert.strictEqual(body.data.subtotal, 28000);
    assert.strictEqual(body.data.custom_additionals_amount, 1500);
    assert.strictEqual(body.data.total_price, 29500);
    assert.strictEqual(body.data.deposit_paid, 10000);
    assert.strictEqual(body.data.balance_pending, 19500);
  });

  test('POST /api/orders rechaza fecha de entrega en el pasado', async () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: 1,
        delivery_date: yesterday,
        items: [{ product_id: 1, quantity: 1 }]
      })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 400);
    assert.ok(body.error.includes('no puede ser anterior'));
  });

  test('POST /api/orders rechaza seña mayor al total', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: 1,
        delivery_date: todayStr,
        deposit_paid: 999999,
        items: [{ product_id: 1, quantity: 1 }]
      })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 400);
    assert.ok(body.error.includes('no puede superar el total'));
  });

  test('POST /api/orders rechaza producto no disponible', async () => {
    // Pausar producto 2 temporalmente
    db.prepare('UPDATE products SET is_available = 0 WHERE id = 2').run();

    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: 1,
        delivery_date: todayStr,
        items: [{ product_id: 2, quantity: 1 }]
      })
    });
    const body = await res.json();

    // Restaurar
    db.prepare('UPDATE products SET is_available = 1 WHERE id = 2').run();

    assert.strictEqual(res.status, 400);
    assert.ok(body.error.includes('no está disponible'));
  });

  test('PUT /api/orders/:id BLOQUEA edición si el pedido no está en estado Pendiente', async () => {
    // Pedido 2 está en estado 'En preparación' en los seeds
    const res = await fetch(`${baseUrl}/orders/2`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        delivery_date: todayStr,
        customer_notes: 'Intento de modificar pedido en producción'
      })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 400);
    assert.ok(body.error.includes('Solo se permite editar pedidos en estado "Pendiente"'));
  });

  test('POST /api/orders/:id/duplicate duplica un pedido como nuevo en Pendiente', async () => {
    const res = await fetch(`${baseUrl}/orders/1/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delivery_date: todayStr })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.data.status, 'Pendiente');
    assert.notStrictEqual(body.data.id, 1);
    assert.strictEqual(body.data.deposit_paid, 0); // Inicia con seña en 0
    assert.ok(body.data.customer_notes.includes('Copia de Pedido #1'));
  });

  test('PATCH /api/orders/:id/favorite conmuta el estado de favorito', async () => {
    const res = await fetch(`${baseUrl}/orders/1/favorite`, { method: 'PATCH' });
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(body.data.is_favorite === 0 || body.data.is_favorite === 1);
  });
});
