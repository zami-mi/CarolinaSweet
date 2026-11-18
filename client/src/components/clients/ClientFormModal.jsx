import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function ClientFormModal({ isOpen, onClose, onSave, client }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
    allergies: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        phone: client.phone || '',
        notes: client.notes || '',
        allergies: client.allergies || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        notes: '',
        allergies: ''
      });
    }
    setError('');
  }, [client, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('El nombre del cliente es obligatorio');
      return;
    }

    if (!formData.phone.trim()) {
      setError('El número de teléfono / WhatsApp es obligatorio');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="eyebrow">GESTIÓN DE CLIENTES</span>
            <h2>{client ? 'Editar cliente' : 'Nuevo cliente habitual'}</h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="form-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="client-name">Nombre y Apellido *</label>
            <input
              id="client-name"
              type="text"
              required
              placeholder="Ej. Martina López"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="client-phone">Teléfono / WhatsApp *</label>
            <input
              id="client-phone"
              type="tel"
              required
              placeholder="Ej. 1123456789"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <small style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '3px' }}>
              Si este cliente hizo pedidos como ocasional previamente, se vincularán automáticamente a su historial.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="client-allergies">Alergias o restricciones alimentarias</label>
            <input
              id="client-allergies"
              type="text"
              placeholder="Ej. Celiaquía, Alergia a nueces, Intolerancia a la lactosa"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="client-notes">Notas sobre gustos y preferencias</label>
            <textarea
              id="client-notes"
              rows="3"
              placeholder="Ej. Le gusta el chocolate blanco, prefiere poco dulce, fecha especial..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : (client ? 'Guardar cambios' : 'Registrar cliente')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
