const { db } = require('../database/db');

class CategoryModel {
  static getAll() {
    return db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
  }

  static getById(id) {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  }

  static create({ name, description = null }) {
    if (!name || !name.trim()) {
      throw new Error('El nombre de la categoría es obligatorio');
    }
    const stmt = db.prepare(`
      INSERT INTO categories (name, description)
      VALUES (?, ?)
    `);
    const result = stmt.run(name.trim(), description ? description.trim() : null);
    return this.getById(result.lastInsertRowid);
  }
}

module.exports = CategoryModel;
