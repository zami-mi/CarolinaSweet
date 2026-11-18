const { db } = require('../database/db');

exports.getSummary = (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.slice(0, 7); // 'YYYY-MM'

    // 1. Facturación del mes: suma de pedidos 'Entregado' en el mes actual
    const salesRow = db.prepare(`
      SELECT COALESCE(SUM(total_price), 0) AS monthly_sales
      FROM orders
      WHERE status = 'Entregado' AND strftime('%Y-%m', delivery_date) = ?
    `).get(currentMonth);

    // 2. Pedidos pendientes de atención
    const pendingRow = db.prepare(`
      SELECT COUNT(*) AS pending_count
      FROM orders
      WHERE status = 'Pendiente'
    `).get();

    // 3. Próximas entregas activas (no entregadas ni canceladas)
    const upcomingRow = db.prepare(`
      SELECT COUNT(*) AS upcoming_count
      FROM orders
      WHERE status IN ('Pendiente', 'En preparación', 'Listo') AND delivery_date >= ?
    `).get(today);

    res.json({
      data: {
        monthly_sales: salesRow.monthly_sales,
        pending_orders_count: pendingRow.pending_count,
        upcoming_deliveries_count: upcomingRow.upcoming_count,
        current_month: currentMonth
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getReminders = (req, res, next) => {
  try {
    const today = new Date();
    const formatDate = (offset) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offset);
      return d.toISOString().split('T')[0];
    };

    const dateToday = formatDate(0);
    const dateTomorrow = formatDate(1);
    const dateLimit = formatDate(3);

    // Consulta de pedidos activos en la ventana de recordatorio (hoy hasta hoy + 3 días)
    const query = `
      SELECT 
        o.id,
        o.client_id,
        COALESCE(c.name, o.occasional_name) AS client_name,
        COALESCE(c.phone, o.occasional_phone) AS client_phone,
        c.allergies AS client_allergies,
        o.status,
        o.delivery_date,
        o.delivery_time,
        o.total_price,
        o.balance_pending,
        o.is_favorite,
        (
          SELECT GROUP_CONCAT(p.name || ' (x' || oi.quantity || ')', ', ')
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ) AS products_summary
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      WHERE o.status IN ('Pendiente', 'En preparación', 'Listo')
        AND o.delivery_date >= ?
        AND o.delivery_date <= ?
      ORDER BY o.delivery_date ASC, o.delivery_time ASC
    `;

    const reminderOrders = db.prepare(query).all(dateToday, dateLimit);

    const reminders = {
      today: reminderOrders.filter(o => o.delivery_date === dateToday),
      tomorrow: reminderOrders.filter(o => o.delivery_date === dateTomorrow),
      upcoming: reminderOrders.filter(o => o.delivery_date > dateTomorrow && o.delivery_date <= dateLimit)
    };

    const totalAlerts = reminderOrders.length;

    res.json({
      data: reminders,
      total_alerts: totalAlerts
    });
  } catch (error) {
    next(error);
  }
};
