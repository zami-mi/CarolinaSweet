import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle, AlertTriangle, Calendar, Clock, DollarSign, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export default function OrderFormModal({ isOpen, onClose, onSave, order, initialClientId = null }) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [clientType, setClientType] = useState('habitual'); // 'habitual' | 'ocasional'
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Campos del formulario
  const [clientId, setClientId] = useState('');
  const [occasionalName, setOccasionalName] = useState('');
  const [occasionalPhone, setOccasionalPhone] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(todayStr);
  const [deliveryTime, setDeliveryTime] = useState('17:00');
  const [customerNotes, setCustomerNotes] = useState('');
  const [customConcept, setCustomConcept] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [depositPaid, setDepositPaid] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Ítems seleccionados
  const [orderItems, setOrderItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar clientes y productos disponibles
  useEffect(() => {
    if (isOpen) {
      setLoadingInitial(true);
      Promise.all([
        api.getClients(),
        api.getProducts({ available_only: true })
      ])
        .then(([clientsRes, prodsRes]) => {
          setClients(clientsRes.data || []);
          setProducts(prodsRes.data || []);
          if (prodsRes.data?.length > 0) {
            setSelectedProductId(prodsRes.data[0].id);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingInitial(false));
    }
  }, [isOpen]);

  // Poblar formulario si se edita un pedido o viene con initialClientId
  useEffect(() => {
    if (order) {
      if (order.client_id) {
        setClientType('habitual');
        setClientId(order.client_id);
      } else {
        setClientType('ocasional');
        setOccasionalName(order.occasional_name || '');
        setOccasionalPhone(order.occasional_phone || '');
      }

      setDeliveryDate(order.delivery_date || todayStr);
      setDeliveryTime(order.delivery_time || '');
      setCustomerNotes(order.customer_notes || '');
      setCustomConcept(order.custom_additionals_concept || '');
      setCustomAmount(order.custom_additionals_amount ? String(order.custom_additionals_amount) : '');
      setDepositPaid(order.deposit_paid ? String(order.deposit_paid) : '');
      setIsFavorite(order.is_favorite === 1);

      if (order.items && order.items.length > 0) {
        setOrderItems(order.items.map(it => ({
          product_id: it.product_id,
          name: it.product_name,
          unit_price: it.unit_price,
          quantity: it.quantity,
          subtotal: it.subtotal
        })));
      }
    } else {
      // Pedido nuevo
      setClientType(initialClientId ? 'habitual' : 'habitual');
      setClientId(initialClientId || '');
      setOccasionalName('');
      setOccasionalPhone('');
      setDeliveryDate(todayStr);
      setDeliveryTime('17:00');
      setCustomerNotes('');
      setCustomConcept('');
      setCustomAmount('');
      setDepositPaid('');
      setIsFavorite(false);
      setOrderItems([]);
    }
    setError('');
  }, [order, initialClientId, isOpen, todayStr]);

  if (!isOpen) return null;

  // Cliente habitual actualmente seleccionado
  const selectedClientObj = clients.find(c => String(c.id) === String(clientId));

  // Manejo de ítems
  const handleAddItem = () => {
    if (!selectedProductId) return;
    const prod = products.find(p => String(p.id) === String(selectedProductId));
    if (!prod) return;

    const qty = Number(selectedQuantity) || 1;
    const existingIndex = orderItems.findIndex(i => i.product_id === prod.id);

    if (existingIndex >= 0) {
      const updated = [...orderItems];
      updated[existingIndex].quantity += qty;
      updated[existingIndex].subtotal = updated[existingIndex].quantity * prod.base_price;
      setOrderItems(updated);
    } else {
      setOrderItems([
        ...orderItems,
        {
          product_id: prod.id,
          name: prod.name,
          unit_price: prod.base_price,
          quantity: qty,
          subtotal: prod.base_price * qty
        }
      ]);
    }
    setSelectedQuantity(1);
  };

  const handleRemoveItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // Cálculos en tiempo real
  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const additionalsNum = Number(customAmount) || 0;
  const totalPrice = subtotal + additionalsNum;
  const depositNum = Number(depositPaid) || 0;
  const balancePending = Math.max(0, totalPrice - depositNum);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (clientType === 'habitual' && !clientId) {
      setError('Por favor seleccioná un cliente habitual');
      return;
    }

    if (clientType === 'ocasional') {
      if (!occasionalName.trim()) {
        setError('El nombre del cliente ocasional es obligatorio');
        return;
      }
      if (!occasionalPhone.trim()) {
        setError('El teléfono del cliente ocasional es obligatorio');
        return;
      }
    }

    if (deliveryDate < todayStr) {
      setError('La fecha de entrega no puede ser anterior a la fecha de hoy');
      return;
    }

    if (orderItems.length === 0) {
      setError('El pedido debe incluir al menos un producto');
      return;
    }

    if (depositNum < 0) {
      setError('La seña no puede ser negativa');
      return;
    }

    if (depositNum > totalPrice) {
      setError(`La seña ($${depositNum}) no puede superar el total del pedido ($${totalPrice})`);
      return;
    }

    const payload = {
      client_id: clientType === 'habitual' ? Number(clientId) : null,
      occasional_name: clientType === 'ocasional' ? occasionalName.trim() : null,
      occasional_phone: clientType === 'ocasional' ? occasionalPhone.trim() : null,
      delivery_date: deliveryDate,
      delivery_time: deliveryTime ? deliveryTime.trim() : null,
      customer_notes: customerNotes ? customerNotes.trim() : null,
      custom_additionals_concept: customConcept ? customConcept.trim() : null,
      custom_additionals_amount: additionalsNum,
      deposit_paid: depositNum,
      is_favorite: isFavorite ? 1 : 0,
      items: orderItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }))
    };

    try {
      setIsSubmitting(true);
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-content-wide">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="eyebrow">PEDIDOS ARTESANALES</span>
            <h2>{order ? `Editar Pedido #${order.id}` : 'Registrar nuevo pedido'}</h2>
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
          {/* SELECCIÓN DE CLIENTE */}
          <div className="form-section-box">
            <label className="section-title-label">1. Datos del Cliente</label>

            <div className="type-toggle-pills" style={{ marginBottom: '12px' }}>
              <button
                type="button"
                className={`type-pill ${clientType === 'habitual' ? 'type-pill-active' : ''}`}
                onClick={() => setClientType('habitual')}
              >
                Cliente habitual registrado
              </button>
              <button
                type="button"
                className={`type-pill ${clientType === 'ocasional' ? 'type-pill-active' : ''}`}
                onClick={() => setClientType('ocasional')}
              >
                Cliente ocasional (WhatsApp rápido)
              </button>
            </div>

            {clientType === 'habitual' ? (
              <div className="form-group">
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                >
                  <option value="">-- Seleccionar cliente habitual --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>

                {selectedClientObj?.allergies && (
                  <div className="client-allergies-box" style={{ marginTop: '8px' }}>
                    <AlertTriangle size={14} className="allergy-icon" />
                    <div>
                      <strong>¡Atención Alergias de {selectedClientObj.name}!</strong>
                      <p>{selectedClientObj.allergies}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="occ-name">Nombre y Apellido *</label>
                  <input
                    id="occ-name"
                    type="text"
                    required
                    placeholder="Ej. Carolina Martínez"
                    value={occasionalName}
                    onChange={(e) => setOccasionalName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="occ-phone">Teléfono / WhatsApp *</label>
                  <input
                    id="occ-phone"
                    type="tel"
                    required
                    placeholder="Ej. 1122334455"
                    value={occasionalPhone}
                    onChange={(e) => setOccasionalPhone(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* PRODUCTOS DEL PEDIDO */}
          <div className="form-section-box">
            <label className="section-title-label">2. Selección de Productos</label>

            <div className="product-picker-row">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                style={{ flex: 1 }}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {formatPrice(p.base_price)}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '70px', textAlign: 'center' }}
                title="Cantidad"
              />

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddItem}
              >
                <Plus size={16} /> Agregar
              </button>
            </div>

            {/* LISTA DE ÍTEMS AGREGADOS */}
            {orderItems.length > 0 ? (
              <div className="order-items-list" style={{ marginTop: '12px' }}>
                {orderItems.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x{item.quantity}</span>
                    <span className="item-subtotal">{formatPrice(item.subtotal)}</span>
                    <button
                      type="button"
                      className="item-delete-btn"
                      onClick={() => handleRemoveItem(index)}
                      title="Quitar producto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-items-warning">Agregá al menos un producto a la lista.</p>
            )}
          </div>

          {/* ADICIONAL PERSONALIZADO */}
          <div className="form-section-box">
            <label className="section-title-label">3. Adicionales o Personalización</label>
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label htmlFor="add-concept">Concepto del adicional (opcional)</label>
                <input
                  id="add-concept"
                  type="text"
                  placeholder="Ej. Topper personalizado, flores naturales, vela dorada..."
                  value={customConcept}
                  onChange={(e) => setCustomConcept(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="add-amount">Monto ($)</label>
                <input
                  id="add-amount"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="Ej. 2500"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* FECHAS Y DESCRIPCIÓN DEL DISEÑO */}
          <div className="form-section-box">
            <label className="section-title-label">4. Fecha de Entrega y Diseño</label>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="order-date">
                  <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Fecha de entrega *
                </label>
                <input
                  id="order-date"
                  type="date"
                  min={todayStr}
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="order-time">
                  <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Hora estimada
                </label>
                <input
                  id="order-time"
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label htmlFor="order-notes">
                Detalle del pedido / Lo que busca el cliente (oculto en tarjetas de inicio)
              </label>
              <textarea
                id="order-notes"
                rows="2"
                placeholder="Ej. Paleta de colores lila y rosa, dedicatoria 'Feliz Cumple Sofi', sin frutas secas..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
              />
            </div>
          </div>

          {/* TOTALES, SEÑA Y SALDO */}
          <div className="order-totals-summary">
            <div className="totals-row">
              <span>Subtotal productos:</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            {additionalsNum > 0 && (
              <div className="totals-row">
                <span>Adicional ({customConcept || 'Personalización'}):</span>
                <strong>+ {formatPrice(additionalsNum)}</strong>
              </div>
            )}

            <div className="totals-row totals-row-main">
              <span>Total del pedido:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <div className="form-row" style={{ marginTop: '12px', alignItems: 'center' }}>
              <div className="form-group">
                <label htmlFor="order-deposit">Seña / Anticipo pagado ($)</label>
                <input
                  id="order-deposit"
                  type="number"
                  min="0"
                  max={totalPrice}
                  step="500"
                  placeholder="0"
                  value={depositPaid}
                  onChange={(e) => setDepositPaid(e.target.value)}
                />
              </div>

              <div className="balance-box">
                <span className="balance-label">Saldo pendiente al entregar:</span>
                <strong className={`balance-amount ${balancePending > 0 ? 'balance-pending-due' : 'balance-pending-zero'}`}>
                  {formatPrice(balancePending)}
                </strong>
              </div>
            </div>
          </div>

          {/* CHECKBOX FAVORITO */}
          <div className="form-checkboxes" style={{ marginTop: '4px' }}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={14} color="var(--rose)" /> Marcar como pedido favorito (frecuente)
              </span>
            </label>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || orderItems.length === 0}>
              {isSubmitting ? 'Guardando...' : (order ? 'Guardar cambios' : 'Crear pedido')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
