const { db } = require('../database/db');

class ClientModel {
  static getAll({ search, include_inactive } = {}) {
    let query = `
      SELECT 
        c.*,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(CASE WHEN o.status = 'Entregado' THEN o.total_price ELSE 0 END), 0) AS total_spent
      FROM clients c
      LEFT JOIN orders o ON o.client_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (!include_inactive || include_inactive === 'false' || include_inactive === 0) {
      query += ' AND c.is_active = 1';
    }

    if (search && search.trim()) {
      query += ' AND (c.name LIKE ? OR c.phone LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    query += ' GROUP BY c.id ORDER BY c.name ASC';

    return db.prepare(query).all(...params);
  }

  static getById(id) {
    const client = db.prepare(`
      SELECT 
        c.*,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(CASE WHEN o.status = 'Entregado' THEN o.total_price ELSE 0 END), 0) AS total_spent
      FROM clients c
      LEFT JOIN orders o ON o.client_id = c.id
      WHERE c.id = ?
      GROUP BY c.id
    `).get(id);

    if (!client) return null;

    // Obtener historial de pedidos asociados
    const orders = db.prepare(`
      SELECT 
        id, status, delivery_date, delivery_time, total_price, deposit_paid, balance_pending, created_at
      FROM orders
      WHERE client_id = ?
      ORDER BY delivery_date DESC, id DESC
    `).all(id);

    return {
      ...client,
      orders
    };
  }

  static getByPhone(phone) {
    if (!phone) return null;
    return db.prepare('SELECT * FROM clients WHERE phone = ?').get(phone.trim());
  }

  static create(data) {
    const { name, phone, notes = null, allergies = null } = data;

    if (!name || !name.trim()) {
      throw new Error('El nombre del cliente es obligatorio');
    }

    if (!phone || !phone.trim()) {
      throw new Error('El teléfono del cliente es obligatorio');
    }

    const cleanPhone = phone.trim();

    // Validar si ya existe un cliente con ese teléfono
    const existing = this.getByPhone(cleanPhone);
    if (existing) {
      throw new Error(`Ya existe un cliente registrado con el teléfono ${cleanPhone} (${existing.name})`);
    }

    const insertStmt = db.prepare(`
      INSERT INTO clients (name, phone, notes, allergies, is_active)
      VALUES (?, ?, ?, ?, 1)
    `);

    const result = insertStmt.run(
      name.trim(),
      cleanPhone,
      notes ? notes.trim() : null,
      allergies ? allergies.trim() : null
    );

    const newClientId = result.lastInsertRowid;

    // REGLA HU-02: Vincular automáticamente pedidos ocasionales previos que coincidan con este número telefónico
    const linkStmt = db.prepare(`
      UPDATE orders
      SET client_id = ?, occasional_name = NULL, occasional_phone = NULL
      WHERE occasional_phone = ?
    `);
    const linkResult = linkStmt.run(newClientId, cleanPhone);

    if (linkResult.changes > 0) {
      console.log(`🔗 Se vincularon automáticamente ${linkResult.changes} pedido(s) previo(s) al nuevo cliente habitual.`);
    }

    return this.getById(newClientId);
  }

  static update(id, data) {
    const existing = this.getById(id);
    if (!existing) return null;

    const name = data.name !== undefined ? data.name.trim() : existing.name;
    if (!name) {
      throw new Error('El nombre no puede estar vacío');
    }

    const phone = data.phone !== undefined ? data.phone.trim() : existing.phone;
    if (!phone) {
      throw new Error('El teléfono no puede estar vacío');
    }

    // Si cambió el teléfono, verificar que no colisione con otro cliente
    if (phone !== existing.phone) {
      const duplicate = this.getByPhone(phone);
      if (duplicate && duplicate.id !== Number(id)) {
        throw new Error(`El teléfono ${phone} ya pertenece a otro cliente (${duplicate.name})`);
      }
    }

    const notes = data.notes !== undefined ? (data.notes ? data.notes.trim() : null) : existing.notes;
    const allergies = data.allergens !== undefined ? (data.allergens ? data.allergens.trim() : null) 
      : (data.allergies !== undefined ? (data.allergies ? data.allergies.trim() : null) : existing.allergies);

    const stmt = db.prepare(`
      UPDATE clients
      SET name = ?, phone = ?, notes = ?, allergies = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(name, phone, notes, allergies, id);

    return this.getById(id);
  }

  static toggleStatus(id, is_active) {
    const existing = this.getById(id);
    if (!existing) return null;

    const newValue = is_active !== undefined ? (is_active ? 1 : 0) : (existing.is_active ? 0 : 1);
    db.prepare('UPDATE clients SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newValue, id);
    return this.getById(id);
  }
}

module.exports = ClientModel;
