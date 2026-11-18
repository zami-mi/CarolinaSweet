const { db } = require('../database/db');

/**
 * Devuelve métricas de ventas filtradas por período.
 * period = day | week | month | year
 */
function getReports(req, res, next) {
  try {
    const { period = 'month' } = req.query;

    const formats = {
      day:   "strftime('%Y-%m-%d', delivery_date) = strftime('%Y-%m-%d', 'now')",
      week:  "strftime('%Y-%W', delivery_date)    = strftime('%Y-%W', 'now')",
      month: "strftime('%Y-%m', delivery_date)    = strftime('%Y-%m', 'now')",
      year:  "strftime('%Y',    delivery_date)    = strftime('%Y',    'now')",
    };

    if (!formats[period]) {
      return res.status(400).json({ error: 'Período inválido. Usar: day, week, month, year' });
    }

    const filter = formats[period];

    // --- Resumen general (pedidos entregados en el período) ---
    const summary = db.prepare(`
      SELECT
        COUNT(*)                         AS total_orders,
        COALESCE(SUM(total_price), 0)    AS total_revenue,
        COALESCE(AVG(total_price), 0)    AS avg_ticket
      FROM orders
      WHERE status = 'Entregado'
        AND ${filter}
    `).get();

    // --- Top 5 productos más vendidos (por unidades) ---
    const topProducts = db.prepare(`
      SELECT
        p.name,
        SUM(oi.quantity)                 AS total_qty,
        SUM(oi.subtotal)                 AS total_revenue
      FROM order_items oi
      JOIN orders  o ON oi.order_id  = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE o.status = 'Entregado'
        AND ${filter}
      GROUP BY p.id, p.name
      ORDER BY total_qty DESC
      LIMIT 5
    `).all();

    // --- Distribución de pedidos por estado en el período (todos los estados) ---
    const byStatus = db.prepare(`
      SELECT
        status,
        COUNT(*) AS count
      FROM orders
      WHERE ${filter}
      GROUP BY status
      ORDER BY count DESC
    `).all();

    return res.json({
      period,
      summary: {
        total_orders:  summary.total_orders,
        total_revenue: Number(summary.total_revenue.toFixed(2)),
        avg_ticket:    Number(summary.avg_ticket.toFixed(2)),
      },
      top_products: topProducts,
      by_status:    byStatus,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getReports };
