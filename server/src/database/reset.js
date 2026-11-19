const { db, initSchema } = require('./db');
const { runSeed } = require('./seed');

function resetDatabase() {
  console.log('🧹 Limpiando datos de prueba y restaurando base limpia...');

  // Eliminar todos los registros en orden de dependencias
  db.exec('PRAGMA foreign_keys = OFF;');
  db.exec('DELETE FROM order_items;');
  db.exec('DELETE FROM orders;');
  db.exec('DELETE FROM products;');
  db.exec('DELETE FROM categories;');
  db.exec('DELETE FROM clients;');
  db.exec('DELETE FROM users;');
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('order_items', 'orders', 'products', 'categories', 'clients', 'users');");
  db.exec('PRAGMA foreign_keys = ON;');

  console.log('🌱 Ejecutando semillas limpias...');
  runSeed();

  console.log('✨ Base de datos restaurada exitosamente.');
}

if (require.main === module) {
  resetDatabase();
}

module.exports = { resetDatabase };
