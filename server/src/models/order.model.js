const { db } = require('../database/db');
const ProductModel = require('./product.model');
const ClientModel = require('./client.model');

class OrderModel {
  static getAll({ status, client_id, date, favorite_only, search } = {}) {
    let query = `
      SELECT 
        o.*,
        c.name AS client_name,
        c.phone AS client_phone,
        c.allergies AS client_allergies,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS items_count,
        (
          SELECT GROUP_CONCAT(p.name || ' (x' || oi.quantity || ')', ', ')
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ) AS products_summary
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    if (client_id) {
      query += ' AND o.client_id = ?';
      params.push(Number(client_id));
    }

    if (date) {
      query += ' AND o.delivery_date = ?';
      params.push(date);
    }

    if (favorite_only === true || favorite_only === 'true' || favorite_only === 1) {
      query += ' AND o.is_favorite = 1';
    }

    if (search && search.trim()) {
      query += ` AND (
        c.name LIKE ? OR 
        o.occasional_name LIKE ? OR 
        c.phone LIKE ? OR 
        o.occasional_phone LIKE ? OR 
        o.id = ?
      )`;
      const term = `%${search.trim()}%`;
      const numTerm = isNaN(Number(search.trim())) ? -1 : Number(search.trim());
      params.push(term, term, term, term, numTerm);
    }

    query += ' ORDER BY o.delivery_date ASC, o.id DESC';

    return db.prepare(query).all(...params);
  }

  static getById(id) {
    const order = db.prepare(`
      SELECT 
        o.*,
        c.name AS client_name,
        c.phone AS client_phone,
        c.notes AS client_notes,
        c.allergies AS client_allergies
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      WHERE o.id = ?
    `).get(id);

    if (!order) return null;

    // Obtener los ítems detallados del pedido
    const items = db.prepare(`
      SELECT 
        oi.*,
        p.name AS product_name,
        p.image_url,
        p.allergens,
        cat.name AS category_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE oi.order_id = ?
    `).all(id);

    return {
      ...order,
      items
    };
  }

  static create(data) {
    const {
      client_id = null,
      occasional_name = null,
      occasional_phone = null,
      delivery_date,
      delivery_time = null,
      customer_notes = null,
      custom_additionals_concept = null,
      custom_additionals_amount = 0,
      deposit_paid = 0,
      is_favorite = 0,
      items = []
    } = data;

    // 1. Validar cliente (debe ser habitual o tener datos de ocasional)
    let finalClientId = client_id ? Number(client_id) : null;
    let finalOccasionalName = occasional_name ? occasional_name.trim() : null;
    let finalOccasionalPhone = occasional_phone ? occasional_phone.trim() : null;

    if (!finalClientId) {
      if (!finalOccasionalName) {
        throw new Error('Debe especificar un cliente habitual o el nombre del cliente ocasional');
      }
      if (!finalOccasionalPhone) {
        throw new Error('El teléfono del cliente es obligatorio');
      }

      // Si el teléfono ingresado coincide con un habitual existente, lo vinculamos automáticamente
      const existingClient = ClientModel.getByPhone(finalOccasionalPhone);
      if (existingClient) {
        finalClientId = existingClient.id;
        finalOccasionalName = null;
        finalOccasionalPhone = null;
      }
    }

    // 2. Validación estricta de fecha de entrega (no puede ser anterior a hoy)
    if (!delivery_date) {
      throw new Error('La fecha de entrega es obligatoria');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (delivery_date < todayStr) {
      throw new Error(`La fecha de entrega (${delivery_date}) no puede ser anterior a la fecha de hoy (${todayStr})`);
    }

    // 3. Validación de ítems
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('El pedido debe contener al menos un producto');
    }

    // Calcular subtotales y congelar precios históricos
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const quantity = Number(item.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error('La cantidad de cada producto debe ser mayor a 0');
      }

      const product = ProductModel.getById(item.product_id);
      if (!product) {
        throw new Error(`El producto con ID ${item.product_id} no existe`);
      }

      if (product.is_available !== 1) {
        throw new Error(`El producto "${product.name}" no está disponible para nuevos pedidos`);
      }

      const unit_price = product.base_price;
      const itemSubtotal = unit_price * quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        product_id: product.id,
        quantity,
        unit_price,
        subtotal: itemSubtotal
      });
    }

    // 4. Cálculos de adicionales y totales
    const additionalsAmount = Number(custom_additionals_amount) || 0;
    if (additionalsAmount < 0) {
      throw new Error('El monto de adicionales no puede ser negativo');
    }

    const total_price = subtotal + additionalsAmount;

    // 5. Validación de seña / anticipo
    const deposit = Number(deposit_paid) || 0;
    if (deposit < 0) {
      throw new Error('La seña no puede ser negativa');
    }
    if (deposit > total_price) {
      throw new Error(`La seña ($${deposit}) no puede superar el total del pedido ($${total_price})`);
    }

    const balance_pending = total_price - deposit;

    // 6. Inserción en base de datos
    const insertOrderStmt = db.prepare(`
      INSERT INTO orders (
        client_id, occasional_name, occasional_phone, status,
        delivery_date, delivery_time, customer_notes,
        subtotal, custom_additionals_concept, custom_additionals_amount,
        total_price, deposit_paid, balance_pending, is_favorite
      )
      VALUES (?, ?, ?, 'Pendiente', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertItemStmt = db.prepare(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `);

    const orderResult = insertOrderStmt.run(
      finalClientId,
      finalOccasionalName,
      finalOccasionalPhone,
      delivery_date,
      delivery_time ? delivery_time.trim() : null,
      customer_notes ? customer_notes.trim() : null,
      subtotal,
      custom_additionals_concept ? custom_additionals_concept.trim() : null,
      additionalsAmount,
      total_price,
      deposit,
      balance_pending,
      is_favorite ? 1 : 0
    );

    const newOrderId = orderResult.lastInsertRowid;

    for (const item of validatedItems) {
      insertItemStmt.run(newOrderId, item.product_id, item.quantity, item.unit_price, item.subtotal);
    }

    return this.getById(newOrderId);
  }

  static update(id, data) {
    const existing = this.getById(id);
    if (!existing) {
      return null;
    }

    // REGLA DE NEGOCIO ESTRICTA: Solo se puede editar en estado Pendiente
    if (existing.status !== 'Pendiente') {
      throw new Error(`No se puede modificar el pedido #${id} porque se encuentra en estado "${existing.status}". Solo se permite editar pedidos en estado "Pendiente".`);
    }

    const {
      client_id = existing.client_id,
      occasional_name = existing.occasional_name,
      occasional_phone = existing.occasional_phone,
      delivery_date = existing.delivery_date,
      delivery_time = existing.delivery_time,
      customer_notes = existing.customer_notes,
      custom_additionals_concept = existing.custom_additionals_concept,
      custom_additionals_amount = existing.custom_additionals_amount,
      deposit_paid = existing.deposit_paid,
      is_favorite = existing.is_favorite,
      items
    } = data;

    // Validación de fecha
    const todayStr = new Date().toISOString().split('T')[0];
    if (delivery_date < todayStr) {
      throw new Error(`La fecha de entrega (${delivery_date}) no puede ser anterior a hoy (${todayStr})`);
    }

    let subtotal = existing.subtotal;
    let validatedItems = null;

    if (items && Array.isArray(items) && items.length > 0) {
      subtotal = 0;
      validatedItems = [];
      for (const item of items) {
        const quantity = Number(item.quantity);
        if (isNaN(quantity) || quantity <= 0) {
          throw new Error('La cantidad debe ser mayor a 0');
        }

        const product = ProductModel.getById(item.product_id);
        if (!product) {
          throw new Error(`Producto ${item.product_id} inexistente`);
        }

        const unit_price = product.base_price;
        const itemSubtotal = unit_price * quantity;
        subtotal += itemSubtotal;

        validatedItems.push({
          product_id: product.id,
          quantity,
          unit_price,
          subtotal: itemSubtotal
        });
      }
    }

    const additionalsAmount = Number(custom_additionals_amount) || 0;
    const total_price = subtotal + additionalsAmount;
    const deposit = Number(deposit_paid) || 0;
    if (deposit > total_price) {
      throw new Error('La seña no puede superar el total');
    }
    const balance_pending = total_price - deposit;

    const updateStmt = db.prepare(`
      UPDATE orders
      SET 
        client_id = ?, occasional_name = ?, occasional_phone = ?,
        delivery_date = ?, delivery_time = ?, customer_notes = ?,
        subtotal = ?, custom_additionals_concept = ?, custom_additionals_amount = ?,
        total_price = ?, deposit_paid = ?, balance_pending = ?, is_favorite = ?
      WHERE id = ?
    `);

    updateStmt.run(
      client_id ? Number(client_id) : null,
      occasional_name ? occasional_name.trim() : null,
      occasional_phone ? occasional_phone.trim() : null,
      delivery_date,
      delivery_time ? delivery_time.trim() : null,
      customer_notes ? customer_notes.trim() : null,
      subtotal,
      custom_additionals_concept ? custom_additionals_concept.trim() : null,
      additionalsAmount,
      total_price,
      deposit,
      balance_pending,
      is_favorite ? 1 : 0,
      id
    );

    if (validatedItems) {
      db.prepare('DELETE FROM order_items WHERE order_id = ?').run(id);
      const insertItemStmt = db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const item of validatedItems) {
        insertItemStmt.run(id, item.product_id, item.quantity, item.unit_price, item.subtotal);
      }
    }

    return this.getById(id);
  }

  static toggleFavorite(id) {
    const existing = this.getById(id);
    if (!existing) return null;

    const nextVal = existing.is_favorite === 1 ? 0 : 1;
    db.prepare('UPDATE orders SET is_favorite = ? WHERE id = ?').run(nextVal, id);
    return this.getById(id);
  }

  static duplicate(id, newDeliveryDate) {
    const original = this.getById(id);
    if (!original) return null;

    const todayStr = new Date().toISOString().split('T')[0];
    const deliveryDate = newDeliveryDate || todayStr;

    // Preparar ítems para el nuevo pedido
    const newItems = original.items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity
    }));

    return this.create({
      client_id: original.client_id,
      occasional_name: original.occasional_name,
      occasional_phone: original.occasional_phone,
      delivery_date: deliveryDate,
      delivery_time: original.delivery_time,
      customer_notes: original.customer_notes ? `[Copia de Pedido #${id}] ${original.customer_notes}` : `[Copia de Pedido #${id}]`,
      custom_additionals_concept: original.custom_additionals_concept,
      custom_additionals_amount: original.custom_additionals_amount,
      deposit_paid: 0, // Inicia sin seña
      is_favorite: 0,
      items: newItems
    });
  }
}

module.exports = OrderModel;
