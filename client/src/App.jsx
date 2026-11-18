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

function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/health')
      .then(res => res.json())
      .then(data => setServerStatus(data))
      .catch(() => setServerStatus({ status: 'error' }));
  }, []);

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
            <h2>Tu negocio hoy</h2>
          </div>
          <div className="profile" title="Carolina Sweet">C</div>
        </header>

        {/* RESUMEN */}
        <section className="summary">
          <article className="summary-card">
            <p>Ventas del mes</p>
            <h3>$ 185.000</h3>
            <span>Resumen de facturación</span>
          </article>

          <article className="summary-card">
            <p>Pedidos pendientes</p>
            <h3>08</h3>
            <span>Requieren atención</span>
          </article>

          <article className="summary-card">
            <p>Próximas entregas</p>
            <h3>05</h3>
            <span>Entregas programadas</span>
          </article>
        </section>

        {/* PEDIDOS RECIENTES */}
        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">ORGANIZACIÓN</p>
              <h2>Pedidos recientes</h2>
            </div>
            <button type="button" className="text-link" onClick={() => setActiveTab('pedidos')}>
              Ver todos
            </button>
          </div>

          <div className="orders">
            <article className="order-card">
              <div>
                <h3>Torta de chocolate artesanal</h3>
                <p>Cliente: Martina López</p>
                <span className="date">Entrega: 20/11/2026</span>
              </div>
              <span className="status pending">Pendiente</span>
            </article>

            <article className="order-card">
              <div>
                <h3>Box de cupcakes decorados</h3>
                <p>Cliente: Sofía Ramírez</p>
                <span className="date">Entrega: 21/11/2026</span>
              </div>
              <span className="status preparing">En preparación</span>
            </article>

            <article className="order-card">
              <div>
                <h3>Cheesecake de frutos rojos</h3>
                <p>Cliente: Lucía Fernández</p>
                <span className="date">Entrega: 22/11/2026</span>
              </div>
              <span className="status ready">Listo</span>
            </article>
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
            <div className="action-card" role="button" tabIndex={0} onClick={() => setActiveTab('pedidos')}>
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

        <footer>
          Carolina Sweet © 2026 · Hecho con cariño ♡
        </footer>
      </main>
    </div>
  );
}

export default App;
