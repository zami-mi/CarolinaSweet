import React from 'react';
import { Phone, AlertTriangle, FileText, ShoppingBag, Edit3, UserCheck, UserX } from 'lucide-react';

export default function ClientCard({ client, onViewDetails, onEdit, onToggleStatus }) {
  const isActive = client.is_active === 1;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const cleanPhoneForWhatsApp = client.phone.replace(/\D/g, '');

  return (
    <article className={`client-card ${!isActive ? 'client-card-inactive' : ''}`}>
      <div className="client-header">
        <div className="client-avatar">
          {client.name.charAt(0).toUpperCase()}
        </div>

        <div className="client-main-info">
          <div className="client-name-row">
            <h3 className="client-name">{client.name}</h3>
            <span className={`badge ${isActive ? 'badge-available' : 'badge-paused'}`}>
              {isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          <a
            href={`https://wa.me/${cleanPhoneForWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="client-phone-link"
            title="Abrir chat en WhatsApp"
          >
            <Phone size={13} /> {client.phone}
          </a>
        </div>
      </div>

      {/* ALERTAS DE ALERGIAS */}
      {client.allergies && (
        <div className="client-allergies-box">
          <AlertTriangle size={14} className="allergy-icon" />
          <div>
            <strong>Alergias / Restricciones:</strong>
            <p>{client.allergies}</p>
          </div>
        </div>
      )}

      {/* NOTAS Y PREFERENCIAS */}
      {client.notes && (
        <div className="client-notes-box">
          <FileText size={13} className="notes-icon" />
          <p>{client.notes}</p>
        </div>
      )}

      {/* MÉTRICAS DE COMPRA */}
      <div className="client-stats">
        <div className="client-stat">
          <span className="stat-label">Pedidos</span>
          <strong>{client.total_orders || 0}</strong>
        </div>
        <div className="client-stat">
          <span className="stat-label">Total compras</span>
          <strong>{formatPrice(client.total_spent)}</strong>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="client-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onViewDetails(client)}
        >
          <ShoppingBag size={14} /> Historial
        </button>

        <button
          type="button"
          className="action-btn"
          title="Editar datos del cliente"
          onClick={() => onEdit(client)}
        >
          <Edit3 size={15} />
        </button>

        <button
          type="button"
          className={`action-btn ${isActive ? 'action-btn-danger' : ''}`}
          title={isActive ? 'Desactivar cliente (baja lógica)' : 'Reactivar cliente'}
          onClick={() => onToggleStatus(client)}
        >
          {isActive ? <UserX size={15} /> : <UserCheck size={15} />}
        </button>
      </div>
    </article>
  );
}
