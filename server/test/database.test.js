const { test, describe } = require('node:test');
const assert = require('node:assert');
const { db } = require('../src/database/db');
const { runSeed } = require('../src/database/seed');

describe('Base de Datos SQLite y Esquema', () => {
  test('Todas las tablas requeridas por la SPEC existen', () => {
    const tables = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all().map(t => t.name);

    const requiredTables = ['users', 'clients', 'categories', 'products', 'orders', 'order_items'];
    for (const table of requiredTables) {
      assert.ok(tables.includes(table), `La tabla "${table}" debe existir en SQLite`);
    }
  });

  test('Los índices requeridos existen', () => {
    const indices = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%'
    `).all().map(i => i.name);

    assert.ok(indices.includes('idx_orders_status'), 'idx_orders_status debe existir');
    assert.ok(indices.includes('idx_orders_delivery_date'), 'idx_orders_delivery_date debe existir');
    assert.ok(indices.includes('idx_clients_phone'), 'idx_clients_phone debe existir');
  });

  test('Los datos semilla se cargan y son consistentes', () => {
    runSeed();

    const users = db.prepare('SELECT * FROM users').all();
    const categories = db.prepare('SELECT * FROM categories').all();
    const products = db.prepare('SELECT * FROM products').all();
    const clients = db.prepare('SELECT * FROM clients').all();
    const orders = db.prepare('SELECT * FROM orders').all();

    assert.ok(users.length >= 1, 'Debe haber al menos 1 usuario administrador');
    assert.strictEqual(users[0].username, 'carolina');
    assert.ok(categories.length >= 4, 'Deben existir al menos 4 categorías');
    assert.ok(products.length >= 5, 'Deben existir al menos 5 productos');
    assert.ok(clients.length >= 3, 'Deben existir al menos 3 clientes habituales');
    assert.ok(orders.length >= 4, 'Deben existir al menos 4 pedidos de prueba');
  });

  test('La integridad de saldos en pedidos es coherente (Total = Seña + Saldo)', () => {
    const orders = db.prepare('SELECT total_price, deposit_paid, balance_pending FROM orders').all();
    for (const order of orders) {
      assert.strictEqual(
        order.total_price,
        order.deposit_paid + order.balance_pending,
        'El total debe ser exactamente la suma de seña pagada y saldo pendiente'
      );
    }
  });

  test('Restricción UNIQUE en teléfono de clientes habituales', () => {
    const existingClient = db.prepare('SELECT phone FROM clients LIMIT 1').get();
    assert.ok(existingClient, 'Debe existir un cliente previo');

    assert.throws(() => {
      const stmt = db.prepare(`
        INSERT INTO clients (name, phone, is_active)
        VALUES ('Duplicado', ?, 1)
      `);
      stmt.run(existingClient.phone);
    }, /UNIQUE constraint failed/, 'No debe permitir insertar dos clientes con el mismo teléfono');
  });
});
