const { db } = require('./db');

function runSeed() {
  console.log('🌱 Ejecutando semillas (seed) en SQLite...');

  // 1. Usuario admin inicial (preparado para autenticación futura)
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (username, password_hash, role)
      VALUES (?, ?, ?)
    `);
    // Hash representativo para desarrollo
    insertUser.run('carolina', '$2b$10$fictitioushashforcarolinaadmin', 'admin');
    console.log('  ✔ Usuario admin Carolina creado');
  }

  // 2. Categorías
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
  if (catCount === 0) {
    const insertCat = db.prepare(`
      INSERT INTO categories (name, description)
      VALUES (?, ?)
    `);
    insertCat.run('Tortas Artesanales', 'Tortas decoradas y personalizadas para celebraciones');
    insertCat.run('Cupcakes & Minis', 'Porciones individuales, cupcakes y minipastelería');
    insertCat.run('Cheesecakes', 'Cheesecakes clásicos y horneados al estilo Nueva York');
    insertCat.run('Boxes Dulces & Desayunos', 'Cajas de regalo y sorpresas dulces artesanales');
    console.log('  ✔ 4 categorías iniciales creadas');
  }

  // 3. Productos
  const prodCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (prodCount === 0) {
    const categories = db.prepare('SELECT id, name FROM categories').all();
    const catMap = Object.fromEntries(categories.map(c => [c.name, c.id]));

    const insertProd = db.prepare(`
      INSERT INTO products (category_id, name, description, base_price, image_url, allergens, is_available, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertProd.run(
      catMap['Tortas Artesanales'],
      'Torta de chocolate artesanal',
      'Bizcocho húmedo de cacao amargo con doble relleno de dulce de leche y ganache de chocolate semiamargo',
      28000,
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
      'Gluten, Huevos, Lácteos',
      1,
      1
    );

    insertProd.run(
      catMap['Cupcakes & Minis'],
      'Box de cupcakes decorados',
      'Caja de 6 cupcakes de vainilla y chocolate con buttercream artesanal en tonos pastel',
      16500,
      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600',
      'Gluten, Huevos, Lácteos',
      1,
      1
    );

    insertProd.run(
      catMap['Cheesecakes'],
      'Cheesecake de frutos rojos',
      'Clásico horneado con base de galletas crocantes y coulis artesanal de frambuesas y moras frescas',
      26000,
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600',
      'Lácteos, Huevos',
      1,
      1
    );

    insertProd.run(
      catMap['Tortas Artesanales'],
      'Torta Red Velvet',
      'Suave bizcochuelo aterciopelado con frosting de cream cheese artesanal',
      30000,
      'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600',
      'Gluten, Huevos, Lácteos',
      1,
      0
    );

    insertProd.run(
      catMap['Boxes Dulces & Desayunos'],
      'Box Desayuno Especial',
      'Incluye mini torta, 2 medialunas, cookies con chips de chocolate y jugo natural',
      35000,
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
      'Gluten, Frutos secos, Lácteos',
      1,
      0
    );

    console.log('  ✔ 5 productos del catálogo creados');
  }

  // 4. Clientes habituales
  const clientCount = db.prepare('SELECT COUNT(*) as count FROM clients').get().count;
  if (clientCount === 0) {
    const insertClient = db.prepare(`
      INSERT INTO clients (name, phone, notes, allergies, is_active)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertClient.run('Martina López', '1123456789', 'Prefiere flores naturales en la decoración', 'Sin nueces ni almendras', 1);
    insertClient.run('Sofía Ramírez', '1134567890', 'Cumpleaños en noviembre, detalles dorados', 'Alergia a frutillas', 1);
    insertClient.run('Lucía Fernández', '1145678901', 'Amante de los cheesecakes para meriendas familiares', 'Sin restricciones conocidas', 1);

    console.log('  ✔ 3 clientes habituales creados');
  }

  // 5. Pedidos de demostración
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  if (orderCount === 0) {
    const clients = db.prepare('SELECT id, name FROM clients').all();
    const clientMap = Object.fromEntries(clients.map(c => [c.name, c.id]));
    const products = db.prepare('SELECT id, name, base_price FROM products').all();
    const prodMap = Object.fromEntries(products.map(p => [p.name, p]));

    const today = new Date();
    const formatDate = (daysOffset) => {
      const d = new Date(today);
      d.setDate(d.getDate() + daysOffset);
      return d.toISOString().split('T')[0];
    };

    const insertOrder = db.prepare(`
      INSERT INTO orders (
        client_id, occasional_name, occasional_phone, status, delivery_date, delivery_time,
        customer_notes, subtotal, custom_additionals_concept, custom_additionals_amount,
        total_price, deposit_paid, balance_pending, is_favorite, delivered_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `);

    // Pedido 1: Martina López - Pendiente (entrega en 2 días)
    const p1 = prodMap['Torta de chocolate artesanal'];
    const res1 = insertOrder.run(
      clientMap['Martina López'], null, null, 'Pendiente', formatDate(2), '17:00',
      'Decoración temática de cumpleaños con detalles rosas', 28000, null, 0,
      28000, 10000, 18000, 1, null
    );
    insertItem.run(res1.lastInsertRowid, p1.id, 1, p1.base_price, p1.base_price);

    // Pedido 2: Sofía Ramírez - En preparación (entrega en 3 días)
    const p2 = prodMap['Box de cupcakes decorados'];
    const res2 = insertOrder.run(
      clientMap['Sofía Ramírez'], null, null, 'En preparación', formatDate(3), '15:30',
      'Caja con cinta rosa y dedicatoria para Sofi', 16500, 'Topper personalizado de 15 años', 2500,
      19000, 10000, 9000, 0, null
    );
    insertItem.run(res2.lastInsertRowid, p2.id, 1, p2.base_price, p2.base_price);

    // Pedido 3: Lucía Fernández - Listo (entrega en 4 días)
    const p3 = prodMap['Cheesecake de frutos rojos'];
    const res3 = insertOrder.run(
      clientMap['Lucía Fernández'], null, null, 'Listo', formatDate(4), '18:00',
      'Poco coulis en los bordes para traslado largo', 26000, null, 0,
      26000, 26000, 0, 0, null
    );
    insertItem.run(res3.lastInsertRowid, p3.id, 1, p3.base_price, p3.base_price);

    // Pedido 4: Ocasional Camila Gómez - Entregado (hace 3 días)
    const p4 = prodMap['Box Desayuno Especial'];
    const res4 = insertOrder.run(
      null, 'Camila Gómez', '1156789012', 'Entregado', formatDate(-3), '10:00',
      'Entrega a domicilio para sorpresa de aniversario', 35000, null, 0,
      35000, 35000, 0, 0, new Date(Date.now() - 3 * 86400000).toISOString()
    );
    insertItem.run(res4.lastInsertRowid, p4.id, 1, p4.base_price, p4.base_price);

    console.log('  ✔ 4 pedidos iniciales creados (con historial y estados variados)');
  }

  console.log('✅ Semillas inicializadas con éxito.');
}

// Ejecutar automáticamente si se llama directamente desde CLI
if (require.main === module) {
  runSeed();
}

module.exports = { runSeed };
