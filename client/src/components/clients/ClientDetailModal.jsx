import React, { useState, useEffect } from 'react';
import { X, Phone, AlertTriangle, ShoppingBag, Calendar, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function ClientDetailModal({ isOpen, onClose, clientId }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId && isOpen) {
      setLoading(true);
      api.getClientById(clientId)
        .then(res => setClient(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [clientId, isOpen]);

  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price || 0);
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

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-content-wide">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="eyebrow">FICHA DE CLIENTE</span>
            <h2>{client ? client.name : 'Cargando...'}</h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Cargando información del cliente...</p>
          </div>
        ) : client ? (
          <div className="client-detail-body">
            {/* ENCABEZADO CON DATOS RÁPIDOS */}
            <div className="client-detail-top">
              <div className="detail-item">
                <span className="detail-label">Teléfono / WhatsApp</span>
                <a
                  href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="client-phone-link"
                >
                  <Phone size={14} /> {client.phone}
                </a>
              </div>

              <div className="detail-item">
                <span className="detail-label">Estado</span>
                <span className={`badge ${client.is_active === 1 ? 'badge-available' : 'badge-paused'}`}>
                  {client.is_active === 1 ? 'Activo' : 'Desactivado'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Total gastado</span>
                <strong>{formatPrice(client.total_spent)}</strong>
              </div>
            </div>

            {/* ALERGIAS Y RESTRICCIONES */}
            {client.allergies && (
              <div className="client-allergies-box" style={{ margin: '16px 0' }}>
                <AlertTriangle size={16} className="allergy-icon" />
                <div>
                  <strong>Alergias o Restricciones Alimentarias:</strong>
                  <p>{client.allergies}</p>
                </div>
              </div>
            )}

            {/* NOTAS Y PREFERENCIAS */}
            {client.notes && (
              <div className="client-notes-box" style={{ margin: '16px 0' }}>
                <strong>Notas sobre gustos del cliente:</strong>
                <p style={{ marginTop: '4px' }}>{client.notes}</p>
              </div>
            )}

            {/* HISTORIAL DE PEDIDOS */}
            <div className="client-orders-section">
              <div className="section-header" style={{ marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--brown)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={16} color="var(--rose)" /> Historial de pedidos ({client.orders?.length || 0})
                </h3>
              </div>

              {client.orders && client.orders.length > 0 ? (
                <div className="client-orders-list">
                  {client.orders.map((order) => (
                    <div key={order.id} className="client-order-item">
                      <div className="order-item-left">
                        <strong>Pedido #{order.id}</strong>
                        <span className="order-item-date">
                          <Calendar size={12} /> Entrega: {order.delivery_date} {order.delivery_time ? `(${order.delivery_time})` : ''}
                        </span>
                      </div>

                      <div className="order-item-right">
                        <span className={`status ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                        <div className="order-item-money">
                          <strong>{formatPrice(order.total_price)}</strong>
                          {order.balance_pending > 0 && (
                            <small style={{ color: '#AD5E65', display: 'block' }}>
                              Saldo: {formatPrice(order.balance_pending)}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-orders-msg">Este cliente aún no tiene pedidos registrados.</p>
              )}
            </div>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button type="button" className="btn btn-primary" onClick={onClose}>
                Cerrar ficha
              </button>
            </div>
          </div>
        ) : (
          <p>No se encontró la información del cliente.</p>
        )}
      </div>
    </div>
  );
}
