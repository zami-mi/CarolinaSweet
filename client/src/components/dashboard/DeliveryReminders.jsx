import React from 'react';
import { Bell, Clock, Calendar, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function DeliveryReminders({ reminders, onOrderClick }) {
  const formatPrice = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const todayList = reminders?.today || [];
  const tomorrowList = reminders?.tomorrow || [];
  const upcomingList = reminders?.upcoming || [];
  const totalCount = todayList.length + tomorrowList.length + upcomingList.length;

  const renderOrderRow = (order, urgencyClass) => (
    <div
      key={order.id}
      className={`reminder-card-row ${urgencyClass}`}
      onClick={() => onOrderClick(order.id)}
      role="button"
      tabIndex={0}
    >
      <div className="reminder-left">
        <div className="reminder-time-badge">
          <Clock size={12} />
          <span>{order.delivery_time || 'Sin hora'}</span>
        </div>

        <div className="reminder-info">
          <div className="reminder-client-title">
            <strong>Pedido #{order.id}: {order.client_name}</strong>
            {order.client_allergies && (
              <span className="kanban-allergy-pill" title={`Alergia: ${order.client_allergies}`}>
                <AlertTriangle size={11} /> Alergia
              </span>
            )}
          </div>
          <p className="reminder-products">{order.products_summary || 'Pastelería'}</p>
        </div>
      </div>

      <div className="reminder-right">
        <div className="reminder-balance">
          {order.balance_pending > 0 ? (
            <span className="balance-due">Saldo: {formatPrice(order.balance_pending)}</span>
          ) : (
            <span className="balance-paid">✓ Pagado</span>
          )}
        </div>
        <ChevronRight size={15} className="reminder-arrow" />
      </div>
    </div>
  );

  return (
    <section className="section reminders-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">ALERTAS Y RECORDATORIOS</p>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="var(--rose)" />
            Recordatorios de entrega ({totalCount})
          </h2>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="reminders-empty-banner">
          <CheckCircle2 size={24} color="#617C5A" />
          <div>
            <strong>¡Todo al día con las entregas!</strong>
            <p>No hay pedidos pendientes para entregar en los próximos 3 días.</p>
          </div>
        </div>
      ) : (
        <div className="reminders-grid">
          {/* HOY */}
          {todayList.length > 0 && (
            <div className="reminder-group group-today">
              <div className="group-header">
                <span className="group-badge badge-today">🚨 ENTREGAS PARA HOY</span>
                <span className="group-count">{todayList.length}</span>
              </div>
              <div className="reminder-list">
                {todayList.map(o => renderOrderRow(o, 'card-today'))}
              </div>
            </div>
          )}

          {/* MAÑANA */}
          {tomorrowList.length > 0 && (
            <div className="reminder-group group-tomorrow">
              <div className="group-header">
                <span className="group-badge badge-tomorrow">⚠️ ENTREGAS DE MAÑANA</span>
                <span className="group-count">{tomorrowList.length}</span>
              </div>
              <div className="reminder-list">
                {tomorrowList.map(o => renderOrderRow(o, 'card-tomorrow'))}
              </div>
            </div>
          )}

          {/* PRÓXIMOS 3 DÍAS */}
          {upcomingList.length > 0 && (
            <div className="reminder-group group-upcoming">
              <div className="group-header">
                <span className="group-badge badge-upcoming">📅 PRÓXIMOS 3 DÍAS</span>
                <span className="group-count">{upcomingList.length}</span>
              </div>
              <div className="reminder-list">
                {upcomingList.map(o => renderOrderRow(o, 'card-upcoming'))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
