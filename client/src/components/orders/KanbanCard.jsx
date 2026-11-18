import React from 'react';
import { Calendar, Clock, Sparkles, AlertTriangle, ChevronDown } from 'lucide-react';

export default function KanbanCard({ order, onClick, onStatusChange, onToggleFavorite }) {
  const formatPrice = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleSelectStatus = (e) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    if (newStatus === order.status) return;

    if (order.status === 'Entregado') {
      const confirmReopen = window.confirm(
        `¿Deseas reabrir el pedido #${order.id} a "${newStatus}" para corrección?`
      );
      if (!confirmReopen) {
        e.target.value = order.status;
        return;
      }
    }

    onStatusChange(order.id, newStatus);
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(order);
  };

  const clientName = order.client_name || order.occasional_name || 'Cliente';

  return (
    <article className="kanban-card" onClick={() => onClick(order.id)}>
      {/* CABECERA DE TARJETA */}
      <div className="kanban-card-header">
        <span className="kanban-card-id">#{order.id}</span>

        <button
          type="button"
          className={`favorite-star-btn ${order.is_favorite === 1 ? 'is-fav' : ''}`}
          onClick={handleStarClick}
          title={order.is_favorite === 1 ? 'Quitar favorito' : 'Marcar favorito'}
        >
          <Sparkles size={14} />
        </button>
      </div>

      {/* CLIENTE */}
      <div className="kanban-client-row">
        <h4 className="kanban-client-name">{clientName}</h4>
        {order.client_allergies && (
          <span className="kanban-allergy-pill" title={`Alergias: ${order.client_allergies}`}>
            <AlertTriangle size={11} /> Alergia
          </span>
        )}
      </div>

      {/* RESUMEN DE PRODUCTOS */}
      <p className="kanban-products-summary">
        {order.products_summary || 'Productos del pedido'}
      </p>

      {/* FECHA Y HORA DE ENTREGA */}
      <div className="kanban-delivery-date">
        <Calendar size={12} />
        <span>{order.delivery_date}</span>
        {order.delivery_time && (
          <span className="kanban-delivery-time">
            <Clock size={11} /> {order.delivery_time}
          </span>
        )}
      </div>

      {/* PIE DE TARJETA: SALDO Y SELECTOR TÁCTIL DE ESTADO */}
      <div className="kanban-card-footer">
        <div className="kanban-balance">
          {order.balance_pending > 0 ? (
            <span className="balance-due">Saldo: {formatPrice(order.balance_pending)}</span>
          ) : (
            <span className="balance-paid">✓ Pagado</span>
          )}
        </div>

        {/* SELECTOR DESPLEGABLE TÁCTIL */}
        <div className="kanban-status-select-wrap" onClick={(e) => e.stopPropagation()}>
          <select
            className={`kanban-status-select status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}
            value={order.status}
            onChange={handleSelectStatus}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En preparación">En preparación</option>
            <option value="Listo">Listo</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          <ChevronDown size={12} className="select-arrow" />
        </div>
      </div>
    </article>
  );
}
