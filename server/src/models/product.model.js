const { db } = require('../database/db');

class ProductModel {
  static getAll({ category_id, available_only, featured_only } = {}) {
    let query = `
      SELECT 
        p.*, 
        c.name AS category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(Number(category_id));
    }

    if (available_only === true || available_only === 'true' || available_only === 1) {
      query += ' AND p.is_available = 1';
    }

    if (featured_only === true || featured_only === 'true' || featured_only === 1) {
      query += ' AND p.is_featured = 1';
    }

    query += ' ORDER BY p.is_featured DESC, p.name ASC';

    return db.prepare(query).all(...params);
  }

  static getById(id) {
    return db.prepare(`
      SELECT 
        p.*, 
        c.name AS category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(id);
  }

  static create(data) {
    const {
      category_id = null,
      name,
      description = null,
      base_price,
      image_url = null,
      allergens = null,
      is_available = 1,
      is_featured = 0
    } = data;

    if (!name || !name.trim()) {
      throw new Error('El nombre del producto es obligatorio');
    }

    const price = Number(base_price);
    if (isNaN(price) || price < 0) {
      throw new Error('El precio base debe ser un número igual o mayor a 0');
    }

    const stmt = db.prepare(`
      INSERT INTO products (
        category_id, name, description, base_price, image_url, allergens, is_available, is_featured
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      category_id ? Number(category_id) : null,
      name.trim(),
      description ? description.trim() : null,
      price,
      image_url ? image_url.trim() : null,
      allergens ? allergens.trim() : null,
      is_available ? 1 : 0,
      is_featured ? 1 : 0
    );

    return this.getById(result.lastInsertRowid);
  }

  static update(id, data) {
    const existing = this.getById(id);
    if (!existing) {
      return null;
    }

    const name = data.name !== undefined ? data.name.trim() : existing.name;
    if (!name) {
      throw new Error('El nombre del producto no puede estar vacío');
    }

    const base_price = data.base_price !== undefined ? Number(data.base_price) : existing.base_price;
    if (isNaN(base_price) || base_price < 0) {
      throw new Error('El precio base debe ser mayor o igual a 0');
    }

    const category_id = data.category_id !== undefined ? (data.category_id ? Number(data.category_id) : null) : existing.category_id;
    const description = data.description !== undefined ? (data.description ? data.description.trim() : null) : existing.description;
    const image_url = data.image_url !== undefined ? (data.image_url ? data.image_url.trim() : null) : existing.image_url;
    const allergens = data.allergens !== undefined ? (data.allergens ? data.allergens.trim() : null) : existing.allergens;
    const is_available = data.is_available !== undefined ? (data.is_available ? 1 : 0) : existing.is_available;
    const is_featured = data.is_featured !== undefined ? (data.is_featured ? 1 : 0) : existing.is_featured;

    const stmt = db.prepare(`
      UPDATE products
      SET 
        category_id = ?,
        name = ?,
        description = ?,
        base_price = ?,
        image_url = ?,
        allergens = ?,
        is_available = ?,
        is_featured = ?
      WHERE id = ?
    `);

    stmt.run(category_id, name, description, base_price, image_url, allergens, is_available, is_featured, id);

    return this.getById(id);
  }

  static toggleAvailability(id, is_available) {
    const existing = this.getById(id);
    if (!existing) return null;

    const newValue = is_available !== undefined ? (is_available ? 1 : 0) : (existing.is_available ? 0 : 1);
    db.prepare('UPDATE products SET is_available = ? WHERE id = ?').run(newValue, id);
    return this.getById(id);
  }

  static delete(id) {
    const existing = this.getById(id);
    if (!existing) return false;

    // Verificar si el producto tiene pedidos asociados en order_items
    const ordersCount = db.prepare('SELECT COUNT(*) as count FROM order_items WHERE product_id = ?').get(id).count;
    if (ordersCount > 0) {
      // Si tiene pedidos asociados, no se borra físicamente para preservar el historial: se pausa
      db.prepare('UPDATE products SET is_available = 0 WHERE id = ?').run(id);
      return { soft_deleted: true, message: 'El producto tiene pedidos asociados, por lo que fue pausado para preservar el historial.' };
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return { deleted: true };
  }
}

module.exports = ProductModel;
