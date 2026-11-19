const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');
const { DB_PATH } = require('../config/env');

// Asegurar que exista el directorio padre para la base de datos
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Conectar a SQLite
const db = new DatabaseSync(DB_PATH);

// Activar soporte de claves foráneas y modo WAL
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

/**
 * Inicializa el esquema de tablas si no existen
 */
function initSchema() {
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schemaSql);

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const { runSeed } = require('./seed');
    runSeed();
  }
}

module.exports = {
  db,
  initSchema
};

// Inicializar esquema y semillas automáticamente al importar la base de datos
initSchema();
