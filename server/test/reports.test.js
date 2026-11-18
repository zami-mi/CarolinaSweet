const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

describe('T08 – Reports', () => {
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

  test('GET /api/reports sin period usa mes por defecto (200)', async () => {
    const res = await fetch(`${baseUrl}/reports`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok('period'       in body, 'falta period');
    assert.ok('summary'      in body, 'falta summary');
    assert.ok('top_products' in body, 'falta top_products');
    assert.ok('by_status'    in body, 'falta by_status');
    assert.strictEqual(body.period, 'month');
  });

  test('GET /api/reports?period=day devuelve estructura válida', async () => {
    const res = await fetch(`${baseUrl}/reports?period=day`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.period, 'day');
    assert.ok(typeof body.summary.total_orders  === 'number');
    assert.ok(typeof body.summary.total_revenue === 'number');
    assert.ok(typeof body.summary.avg_ticket    === 'number');
    assert.ok(Array.isArray(body.top_products));
    assert.ok(Array.isArray(body.by_status));
  });

  test('GET /api/reports?period=week devuelve estructura válida', async () => {
    const res = await fetch(`${baseUrl}/reports?period=week`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.period, 'week');
    assert.ok(typeof body.summary.total_orders === 'number');
  });

  test('GET /api/reports?period=year devuelve top_products como array', async () => {
    const res = await fetch(`${baseUrl}/reports?period=year`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(body.top_products));
    // Si hay pedidos entregados en el año, top_products no debería ser vacío
    // (el seed incluye pedidos de demostración)
  });

  test('GET /api/reports?period=invalido devuelve 400', async () => {
    const res = await fetch(`${baseUrl}/reports?period=invalido`);
    assert.strictEqual(res.status, 400);
  });
});
