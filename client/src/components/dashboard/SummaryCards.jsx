import React from 'react';

export default function SummaryCards({ summary }) {
  const formatPrice = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatCount = (val) => {
    return (val || 0).toString().padStart(2, '0');
  };

  return (
    <section className="summary">
      <article className="summary-card">
        <p>Ventas del mes</p>
        <h3>{formatPrice(summary?.monthly_sales)}</h3>
        <span>Facturación de pedidos entregados</span>
      </article>

      <article className="summary-card">
        <p>Pedidos pendientes</p>
        <h3>{formatCount(summary?.pending_orders_count)}</h3>
        <span>Requieren atención</span>
      </article>

      <article className="summary-card">
        <p>Próximas entregas</p>
        <h3>{formatCount(summary?.upcoming_deliveries_count)}</h3>
        <span>Entregas en producción</span>
      </article>
    </section>
  );
}
