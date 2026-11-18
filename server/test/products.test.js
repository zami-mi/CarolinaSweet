const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

describe('Módulo de Catálogo y Categorías (API)', () => {
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

  test('GET /api/categories retorna listado de categorías', async () => {
    const res = await fetch(`${baseUrl}/categories`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 4);
    assert.ok(body.data.some(c => c.name === 'Tortas Artesanales'));
  });

  test('POST /api/categories valida nombre obligatorio', async () => {
    const res = await fetch(`${baseUrl}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '' })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 400);
    assert.ok(body.error.includes('obligatorio'));
  });

  test('GET /api/products retorna productos con nombre de categoría', async () => {
    const res = await fetch(`${baseUrl}/products`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 5);
    assert.ok(body.data[0].category_name, 'Debe incluir category_name gracias al JOIN');
  });

  test('POST /api/products valida que el precio no sea negativo', async () => {
    const res = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Producto Precio Negativo',
        base_price: -500
      })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 400);
    assert.ok(body.error.includes('mayor a 0'));
  });

  test('POST /api/products crea un producto nuevo exitosamente', async () => {
    const res = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lemon Pie Clásico',
        description: 'Masa sableé crocante, crema suave de limón y merengue italiano flambeado',
        base_price: 24000,
        allergens: 'Gluten, Huevos, Lácteos',
        is_available: 1,
        is_featured: 1
      })
    });
    const body = await res.json();

    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.data.name, 'Lemon Pie Clásico');
    assert.strictEqual(body.data.base_price, 24000);
    assert.strictEqual(body.data.is_featured, 1);
  });

  test('PATCH /api/products/:id/availability cambia disponibilidad', async () => {
    // Tomar un producto existente
    const listRes = await fetch(`${baseUrl}/products`);
    const { data: products } = await listRes.json();
    const target = products[0];

    const toggleRes = await fetch(`${baseUrl}/products/${target.id}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_available: target.is_available === 1 ? 0 : 1 })
    });
    const body = await toggleRes.json();

    assert.strictEqual(toggleRes.status, 200);
    assert.notStrictEqual(body.data.is_available, target.is_available);
  });

  test('DELETE /api/products/:id pausa el producto si tiene pedidos asociados para proteger el historial', async () => {
    // El producto 1 (Torta de chocolate) tiene pedidos en los seeds
    const res = await fetch(`${baseUrl}/products/1`, {
      method: 'DELETE'
    });
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.soft_deleted, true);
    assert.ok(body.message.includes('preservar el historial'));
  });
});
