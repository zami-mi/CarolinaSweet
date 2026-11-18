const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

describe('Módulo Dashboard y Recordatorios (API)', () => {
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

  test('GET /api/dashboard/summary retorna métricas numéricas válidas', async () => {
    const res = await fetch(`${baseUrl}/dashboard/summary`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(body.data !== undefined);
    assert.ok(typeof body.data.monthly_sales === 'number');
    assert.ok(typeof body.data.pending_orders_count === 'number');
    assert.ok(typeof body.data.upcoming_deliveries_count === 'number');
  });

  test('GET /api/dashboard/reminders retorna recordatorios clasificados por Hoy, Mañana y Próximos 3 días', async () => {
    const res = await fetch(`${baseUrl}/dashboard/reminders`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(body.data !== undefined);
    assert.ok(Array.isArray(body.data.today));
    assert.ok(Array.isArray(body.data.tomorrow));
    assert.ok(Array.isArray(body.data.upcoming));
    assert.ok(typeof body.total_alerts === 'number');

    // Ningún pedido en recordatorios debe ser 'Entregado' ni 'Cancelado'
    const allReminders = [...body.data.today, ...body.data.tomorrow, ...body.data.upcoming];
    for (const rem of allReminders) {
      assert.ok(rem.status !== 'Entregado' && rem.status !== 'Cancelado');
    }
  });
});
