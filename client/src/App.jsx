import { useState, useEffect } from 'react';
import { 
  Home, 
  ShoppingBag, 
  Heart, 
  Users, 
  BarChart3, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { api } from './services/api';
import CatalogPage from './pages/CatalogPage';
import ClientsPage from './pages/ClientsPage';
import OrdersPage from './pages/OrdersPage';
import OrderFormModal from './components/orders/OrderFormModal';
import OrderDetailModal from './components/orders/OrderDetailModal';

function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [serverStatus, setServerStatus] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  // Modales globales para acceso rápido
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const loadInitialData = () => {
    api.getHealth()
      .then(data => setServerStatus(data))
      .catch(() => setServerStatus({ status: 'error' }));

    api.getOrders()
      .then(res => setRecentOrders(res.data?.slice(0, 5) || []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadInitialData();
  }, [activeTab]);

  const handleOpenNewOrder = () => {
    setIsOrderFormOpen(true);
  };

  const handleOpenOrderDetail = (orderId) => {
    setSelectedOrderId(orderId);
    setIsOrderDetailOpen(true);
  };

  const handleSaveOrder = async (orderPayload) => {
    await api.createOrder(orderPayload);
    loadInitialData();
  };

  const handleDuplicateOrder = async (order) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await api.duplicateOrder(order.id, todayStr);
      setIsOrderDetailOpen(false);
      loadInitialData();
      alert(`Pedido #${order.id} duplicado exitosamente en estado Pendiente.`);
    } catch (err) {
      alert(err.message || 'Error al duplicar pedido');
    }
  };

  const handleToggleFavorite = async (order) => {
    await api.toggleFavoriteOrder(order.id);
    loadInitialData();
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
    <div className="app">
      {/* BARRA LATERAL */}
      <aside className="sidebar">
        <div className="brand">
          <h1>Carolina <span>Sweet</span></h1>
          <p>PASTELERÍA ARTESANAL</p>
        </div>

        <nav>
          <button 
            type="button"
            className={activeTab === 'inicio' ? 'active' : ''} 
            onClick={() => setActiveTab('inicio')}
          >
            <Home size={17} /> Inicio
          </button>
          <button 
            type="button"
            className={activeTab === 'pedidos' ? 'active' : ''} 
            onClick={() => setActiveTab('pedidos')}
          >
            <ShoppingBag size={17} /> Pedidos
          </button>
          <button 
            type="button"
            className={activeTab === 'catalogo' ? 'active' : ''} 
            onClick={() => setActiveTab('catalogo')}
          >
            <Heart size={17} /> Catálogo
          </button>
          <button 
            type="button"
            className={activeTab === 'clientes' ? 'active' : ''} 
            onClick={() => setActiveTab('clientes')}
          >
            <Users size={17} /> Clientes
          </button>
          <button 
            type="button"
            className={activeTab === 'reportes' ? 'active' : ''} 
            onClick={() => setActiveTab('reportes')}
          >
            <BarChart3 size={17} /> Reportes
          </button>
        </nav>

        <div className="sidebar-footer">
          <p>Panel de administración</p>
          {serverStatus && (
            <div style={{ marginTop: '8px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              {serverStatus.status === 'ok' ? (
                <span style={{ color: '#617C5A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> Servidor conectado
                </span>
              ) : (
                <span style={{ color: '#AD5E65', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> Backend desconectado
                </span>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="greeting">¡Hola, Carolina!</p>
            <h2>
              {activeTab === 'inicio' && 'Tu negocio hoy'}
              {activeTab === 'pedidos' && 'Gestión y Tablero Kanban'}
              {activeTab === 'catalogo' && 'Catálogo de creaciones'}
              {activeTab === 'clientes' && 'Agenda de clientes'}
              {activeTab === 'reportes' && 'Reportes periódicos'}
            </h2>
          </div>
          <div className="profile" title="Carolina Sweet">C</div>
        </header>

        {/* VISTA DE INICIO */}
        {activeTab === 'inicio' && (
          <>
            {/* RESUMEN */}
            <section className="summary">
              <article className="summary-card">
                <p>Ventas del mes</p>
                <h3>$ 185.000</h3>
                <span>Resumen de facturación</span>
              </article>

              <article className="summary-card">
                <p>Pedidos pendientes</p>
                <h3>{recentOrders.filter(o => o.status === 'Pendiente').length.toString().padStart(2, '0')}</h3>
                <span>Requieren atención</span>
              </article>

              <article className="summary-card">
                <p>Próximas entregas</p>
                <h3>{recentOrders.filter(o => o.status !== 'Entregado' && o.status !== 'Cancelado').length.toString().padStart(2, '0')}</h3>
                <span>Entregas en curso</span>
              </article>
            </section>

            {/* PEDIDOS RECIENTES */}
            <section className="section">
              <div className="section-header">
                <div>
                  <p className="eyebrow">ORGANIZACIÓN</p>
                  <h2>Pedidos recientes ({recentOrders.length})</h2>
                </div>
                <button type="button" className="text-link" onClick={() => setActiveTab('pedidos')}>
                  Ver en Tablero Kanban
                </button>
              </div>

              <div className="orders">
                {recentOrders.map((order) => (
                  <article 
                    key={order.id} 
                    className="order-card" 
                    role="button" 
                    tabIndex={0}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenOrderDetail(order.id)}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h3>Pedido #{order.id}: {order.products_summary || 'Pedido de pastelería'}</h3>
                        {order.is_favorite === 1 && <Sparkles size={13} color="var(--rose)" />}
                      </div>
                      <p>Cliente: {order.client_name || order.occasional_name}</p>
                      <span className="date">Entrega: {order.delivery_date} {order.delivery_time ? `(${order.delivery_time})` : ''}</span>
                    </div>
                    <span className={`status ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </article>
                ))}
              </div>
            </section>

            {/* ACCESOS RÁPIDOS */}
            <section className="section">
              <div className="section-header">
                <div>
                  <p className="eyebrow">GESTIONÁ TU NEGOCIO</p>
                  <h2>Accesos rápidos</h2>
                </div>
              </div>

              <div className="quick-actions">
                <div className="action-card" role="button" tabIndex={0} onClick={handleOpenNewOrder}>
                  <span><PlusCircle size={28} /></span>
                  <h3>Nuevo pedido</h3>
                  <p>Registrar una nueva venta</p>
                </div>

                <div className="action-card" role="button" tabIndex={0} onClick={() => setActiveTab('catalogo')}>
                  <span><Sparkles size={28} /></span>
                  <h3>Agregar producto</h3>
                  <p>Actualizar tu catálogo</p>
                </div>

                <div className="action-card" role="button" tabIndex={0} onClick={() => setActiveTab('clientes')}>
                  <span><Users size={28} /></span>
                  <h3>Nuevo cliente</h3>
                  <p>Guardar sus datos</p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* VISTAS MODULARES */}
        {activeTab === 'pedidos' && <OrdersPage />}
        {activeTab === 'catalogo' && <CatalogPage />}
        {activeTab === 'clientes' && <ClientsPage />}

        {activeTab === 'reportes' && (
          <div className="empty-state">
            <BarChart3 size={32} style={{ color: 'var(--rose)', margin: '0 auto 12px' }} />
            <h3>Reportes y Dashboard Periódico</h3>
            <p>Se implementará en las tareas T07 y T08.</p>
          </div>
        )}

        <footer>
          Carolina Sweet © 2026 · Hecho con cariño ♡
        </footer>
      </main>

      {/* MODAL GLOBAL RÁPIDO PARA CREAR PEDIDO DESDE INICIO */}
      <OrderFormModal
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        onSave={handleSaveOrder}
      />

      {/* MODAL GLOBAL DE DETALLE DESDE INICIO */}
      <OrderDetailModal
        isOpen={isOrderDetailOpen}
        onClose={() => setIsOrderDetailOpen(false)}
        orderId={selectedOrderId}
        onDuplicate={handleDuplicateOrder}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}

export default App;
