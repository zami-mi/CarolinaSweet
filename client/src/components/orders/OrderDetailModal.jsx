import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  Calendar, 
  Clock, 
  Sparkles, 
  Copy, 
  Edit3, 
  AlertTriangle, 
  FileText, 
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import { api } from '../../services/api';

export default function OrderDetailModal({ isOpen, onClose, orderId, onEdit, onDuplicate, onToggleFavorite }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = () => {
    if (orderId && isOpen) {
      setLoading(true);
      api.getOrderById(orderId)
        .then(res => setOrder(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId, isOpen]);

  if (!isOpen) return null;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pendiente': return 'pending';
      case 'En preparación': return 'preparing';
      case 'Listo': return 'ready';
      case 'Entregado': return 'delivered';
      case 'Cancelado': return 'cancelled';
      default: return 'pending';
    }
  };

  const clientName = order?.client_name || order?.occasional_name || 'Cliente';
  const clientPhone = order?.client_phone || order?.occasional_phone || '';
  const cleanPhone = clientPhone.replace(/\D/g, '');

  const canEdit = order?.status === 'Pendiente';

  const handleFavoriteClick = async () => {
    try {
      await onToggleFavorite(order);
      loadOrder();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-content-wide">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="eyebrow">DETALLE DE PEDIDO</span>
              {order?.is_favorite === 1 && (
                <span className="badge badge-featured" style={{ fontSize: '10px' }}>
                  <Sparkles size={11} /> Favorito
                </span>
              )}
            </div>
            <h2>Pedido #{orderId}</h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Cargando información del pedido...</p>
          </div>
        ) : order ? (
          <div className="order-detail-container">
            {/* ESTADO Y FECHA */}
            <div className="order-summary-bar">
              <div className="order-summary-pill">
                <span className="detail-label">Estado actual</span>
                <span className={`status ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-summary-pill">
                <span className="detail-label">Fecha de entrega</span>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}>
                  <Calendar size={14} color="var(--rose)" /> {order.delivery_date} {order.delivery_time ? `(${order.delivery_time})` : ''}
                </strong>
              </div>

              <div className="order-summary-pill">
                <span className="detail-label">Saldo restante</span>
                <strong style={{ color: order.balance_pending > 0 ? '#AD5E65' : '#617C5A', fontSize: '14px' }}>
                  {formatPrice(order.balance_pending)}
                </strong>
              </div>
            </div>

            {/* DATOS DEL CLIENTE */}
            <div className="detail-card-box">
              <span className="box-title">Datos del Cliente</span>
              <div className="client-data-row">
                <div>
                  <h4 style={{ fontSize: '15px', color: 'var(--brown)', margin: 0 }}>{clientName}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    {order.client_id ? 'Cliente habitual' : 'Cliente ocasional'}
                  </span>
                </div>

                {clientPhone && (
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="client-phone-link"
                  >
                    <Phone size={13} /> {clientPhone} (WhatsApp)
                  </a>
                )}
              </div>

              {order.client_allergies && (
                <div className="client-allergies-box" style={{ marginTop: '10px' }}>
                  <AlertTriangle size={14} className="allergy-icon" />
                  <div>
                    <strong>Alergias registradas del cliente:</strong>
                    <p>{order.client_allergies}</p>
                  </div>
                </div>
              )}
            </div>

            {/* PRODUCTOS SOLICITADOS */}
            <div className="detail-card-box">
              <span className="box-title">Productos del Pedido</span>
              <div className="detail-items-table">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="detail-item-row">
                    <div className="detail-item-main">
                      <strong>{item.product_name}</strong>
                      <span className="detail-item-meta">
                        {formatPrice(item.unit_price)} × {item.quantity} u.
                      </span>
                    </div>
                    <span className="detail-item-subtotal">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}

                {order.custom_additionals_amount > 0 && (
                  <div className="detail-item-row detail-item-row-extra">
                    <div className="detail-item-main">
                      <strong>Adicional: {order.custom_additionals_concept || 'Personalización'}</strong>
                    </div>
                    <span className="detail-item-subtotal">
                      + {formatPrice(order.custom_additionals_amount)}
                    </span>
                  </div>
                )}
              </div>

              {/* TOTALES */}
              <div className="detail-totals-box">
                <div className="totals-subrow">
                  <span>Subtotal:</span>
                  <strong>{formatPrice(order.subtotal)}</strong>
                </div>
                <div className="totals-subrow totals-highlight">
                  <span>Total Pedido:</span>
                  <span>{formatPrice(order.total_price)}</span>
                </div>
                <div className="totals-subrow">
                  <span>Seña / Anticipo pagado:</span>
                  <strong>{formatPrice(order.deposit_paid)}</strong>
                </div>
                <div className="totals-subrow totals-balance-due">
                  <span>Saldo a cobrar en entrega:</span>
                  <strong>{formatPrice(order.balance_pending)}</strong>
                </div>
              </div>
            </div>

            {/* DESCRIPCIÓN DEL DISEÑO / LO QUE BUSCA EL CLIENTE */}
            {order.customer_notes && (
              <div className="detail-card-box">
                <span className="box-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={14} color="var(--rose)" /> Detalle del diseño / Lo que busca el cliente
                </span>
                <p className="order-notes-full">{order.customer_notes}</p>
              </div>
            )}

            {/* ACCIONES DEL MODAL */}
            <div className="modal-actions-spread">
              <div className="actions-left">
                <button
                  type="button"
                  className="btn btn-secondary"
                  title="Duplicar este pedido como uno nuevo en Pendiente"
                  onClick={() => onDuplicate(order)}
                >
                  <Copy size={14} /> Duplicar pedido
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleFavoriteClick}
                >
                  <Sparkles size={14} color="var(--rose)" />
                  {order.is_favorite === 1 ? 'Quitar favorito' : 'Favorito'}
                </button>
              </div>

              <div className="actions-right">
                {canEdit ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      onClose();
                      onEdit(order);
                    }}
                  >
                    <Edit3 size={14} /> Editar pedido
                  </button>
                ) : (
                  <small style={{ color: 'var(--muted)', fontSize: '11px', alignSelf: 'center' }}>
                    (Edición bloqueada: pedido en producción)
                  </small>
                )}

                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>No se encontró el pedido.</p>
        )}
      </div>
    </div>
  );
}
