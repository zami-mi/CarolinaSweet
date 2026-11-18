const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

describe('T09 – Pruebas de Integración y Ciclo de Vida Completo', () => {
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

  test('Ciclo E2E: Cliente -> Pedido -> Saldo -> Kanban -> Reportes -> Duplicación', async () => {
    const randomPhone = '11' + Math.floor(10000000 + Math.random() * 90000000);

    // 1. Crear nuevo cliente habitual
    const clientRes = await fetch(`${baseUrl}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Valentina Ciclo E2E',
        phone: randomPhone,
        notes: 'Cliente para prueba integral de flujo',
        allergies: 'Celíaca - Sin TACC estricto'
      })
    });
    const clientBody = await clientRes.json();
    assert.strictEqual(clientRes.status, 201);
    const clientId = clientBody.data.id;
    assert.ok(clientId, 'Debe devolver el id del nuevo cliente');

    // 2. Obtener un producto activo del catálogo
    const prodRes = await fetch(`${baseUrl}/products?available_only=true`);
    const prodBody = await prodRes.json();
    assert.strictEqual(prodRes.status, 200);
    assert.ok(prodBody.data.length > 0, 'Debe haber productos disponibles');
    const product = prodBody.data[0];

    // 3. Crear pedido con cliente habitual, adicionales personalizados y seña
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const deliveryDate = tomorrow.toISOString().split('T')[0];

    const orderRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        delivery_date: deliveryDate,
        delivery_time: '16:00',
        customer_notes: 'Caja con cinta dorada y tarjeta de felicitaciones',
        custom_additionals_concept: 'Velas artesanales y bengala dorada',
        custom_additionals_amount: 1500,
        deposit_paid: 2000,
        items: [
          {
            product_id: product.id,
            quantity: 2
          }
        ]
      })
    });
    const orderBody = await orderRes.json();
    assert.strictEqual(orderRes.status, 201);
    const order = orderBody.data;
    assert.ok(order.id, 'El pedido debe crearse con un id');
    assert.strictEqual(order.status, 'Pendiente');

    // Verificar cálculos financieros: subtotal + adicionales = total; total - seña = saldo
    const expectedSubtotal = product.base_price * 2;
    const expectedTotal = expectedSubtotal + 1500;
    const expectedBalance = expectedTotal - 2000;
    assert.strictEqual(order.subtotal, expectedSubtotal);
    assert.strictEqual(order.total_price, expectedTotal);
    assert.strictEqual(order.balance_pending, expectedBalance);

    // 4. Conmutar favorito
    const favRes = await fetch(`${baseUrl}/orders/${order.id}/favorite`, { method: 'PATCH' });
    const favBody = await favRes.json();
    assert.strictEqual(favRes.status, 200);
    assert.strictEqual(favBody.data.is_favorite, 1);

    // 5. Transición en Kanban: Pendiente -> En preparación
    const prepRes = await fetch(`${baseUrl}/orders/${order.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'En preparación' })
    });
    assert.strictEqual(prepRes.status, 200);

    // 6. Regla de negocio: Edición bloqueada cuando NO está en 'Pendiente'
    const editRes = await fetch(`${baseUrl}/orders/${order.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        delivery_date: deliveryDate,
        items: [{ product_id: product.id, quantity: 3 }]
      })
    });
    assert.strictEqual(editRes.status, 400);

    // 7. Transición en Kanban: En preparación -> Listo
    const readyRes = await fetch(`${baseUrl}/orders/${order.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Listo' })
    });
    assert.strictEqual(readyRes.status, 200);

    // 8. Transición en Kanban: Listo -> Entregado (debe registrar delivered_at)
    const deliverRes = await fetch(`${baseUrl}/orders/${order.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Entregado' })
    });
    const deliverBody = await deliverRes.json();
    assert.strictEqual(deliverRes.status, 200);
    assert.ok(deliverBody.data.delivered_at, 'Debe tener marca de tiempo delivered_at');

    // 9. Duplicar pedido como nuevo en Pendiente
    const todayStr = new Date().toISOString().split('T')[0];
    const dupRes = await fetch(`${baseUrl}/orders/${order.id}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delivery_date: todayStr })
    });
    const dupBody = await dupRes.json();
    assert.strictEqual(dupRes.status, 201);
    assert.strictEqual(dupBody.data.status, 'Pendiente');
    assert.strictEqual(dupBody.data.total_price, order.total_price);
    assert.notStrictEqual(dupBody.data.id, order.id);
  });
});
