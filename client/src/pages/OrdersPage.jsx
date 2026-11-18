import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  LayoutGrid, 
  List, 
  RefreshCw, 
  Calendar,
  AlertTriangle 
} from 'lucide-react';
import { api } from '../services/api';
import KanbanBoard from '../components/orders/KanbanBoard';
import OrderFormModal from '../components/orders/OrderFormModal';
import OrderDetailModal from '../components/orders/OrderDetailModal';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros y vistas
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getOrders({
        search: searchTerm || undefined,
        favorite_only: onlyFavorites ? true : undefined
      });
      setOrders(res.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [searchTerm, onlyFavorites]);

  const handleOpenCreate = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDetailOpen(true);
  };

  const handleSaveOrder = async (payload) => {
    if (editingOrder) {
      await api.updateOrder(editingOrder.id, payload);
    } else {
      await api.createOrder(payload);
    }
    await loadOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado del pedido');
    }
  };

  const handleToggleFavorite = async (order) => {
    try {
      await api.toggleFavoriteOrder(order.id);
      await loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (order) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await api.duplicateOrder(order.id, todayStr);
      setIsDetailOpen(false);
      await loadOrders();
      alert(`Pedido #${order.id} duplicado exitosamente en estado Pendiente.`);
    } catch (err) {
      alert(err.message || 'Error al duplicar');
    }
  };

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

  return (
    <div className="orders-page">
      {/* HEADER DE SECCIÓN */}
      <div className="section-header catalog-header">
        <div>
          <p className="eyebrow">CONTROL DE PRODUCCIÓN</p>
          <h2>Tablero de pedidos ({orders.length})</h2>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} /> Nuevo pedido
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="catalog-toolbar">
        {/* BUSCADOR */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por cliente, teléfono o #ID de pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TOGGLE SOLO FAVORITOS */}
        <div className="toolbar-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={onlyFavorites}
              onChange={(e) => setOnlyFavorites(e.target.checked)}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} color="var(--rose)" /> Solo favoritos
            </span>
          </label>
        </div>

        {/* SWITCH DE VISTA: KANBAN VS LISTA */}
        <div className="view-mode-buttons">
          <button
            type="button"
            className={`view-btn ${viewMode === 'kanban' ? 'view-btn-active' : ''}`}
            onClick={() => setViewMode('kanban')}
            title="Vista Tablero Kanban"
          >
            <LayoutGrid size={15} /> Kanban
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === 'list' ? 'view-btn-active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Vista Lista / Historial"
          >
            <List size={15} /> Lista
          </button>
        </div>
      </div>

      {/* ESTADOS DE CARGA Y ERROR */}
      {loading && (
        <div className="loading-state">
          <RefreshCw className="spin-icon" size={24} />
          <p>Cargando pedidos y tablero...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={loadOrders}>
            Reintentar
          </button>
        </div>
      )}

      {/* VISTA KANBAN */}
      {!loading && !error && viewMode === 'kanban' && (
        <KanbanBoard
          orders={orders}
          onOrderClick={handleOpenDetail}
          onStatusChange={handleStatusChange}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* VISTA LISTA / TABLA */}
      {!loading && !error && viewMode === 'list' && (
        <div className="orders-list-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Fecha Entrega</th>
                <th>Total</th>
                <th>Saldo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                    No hay pedidos para mostrar.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} onClick={() => handleOpenDetail(o.id)} style={{ cursor: 'pointer' }}>
                    <td>
                      <strong>#{o.id}</strong>
                      {o.is_favorite === 1 && (
                        <Sparkles size={11} color="var(--rose)" style={{ marginLeft: '4px' }} />
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: '500', color: 'var(--brown)' }}>
                        {o.client_name || o.occasional_name}
                      </div>
                      <small style={{ color: 'var(--muted)', fontSize: '11px' }}>
                        {o.client_phone || o.occasional_phone}
                      </small>
                    </td>
                    <td>
                      <span className="table-products-summary">
                        {o.products_summary || 'Sin productos'}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <Calendar size={12} color="var(--rose)" /> {o.delivery_date}
                      </span>
                    </td>
                    <td><strong>{formatPrice(o.total_price)}</strong></td>
                    <td>
                      <span style={{ color: o.balance_pending > 0 ? '#AD5E65' : '#617C5A', fontWeight: 'bold' }}>
                        {formatPrice(o.balance_pending)}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${getStatusClass(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className={`kanban-status-select status-${o.status.toLowerCase().replace(/\s+/g, '-')}`}
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En preparación">En preparación</option>
                        <option value="Listo">Listo</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CREAR / EDITAR */}
      <OrderFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveOrder}
        order={editingOrder}
      />

      {/* MODAL DETALLE */}
      <OrderDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        orderId={selectedOrderId}
        onEdit={(order) => {
          setEditingOrder(order);
          setIsFormOpen(true);
        }}
        onDuplicate={handleDuplicate}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}
