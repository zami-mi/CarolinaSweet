import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PackageCheck, 
  Award, 
  PieChart, 
  Calendar,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function ReportsPage() {
  const [period, setPeriod] = useState('month');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async (selectedPeriod = period) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReports(selectedPeriod);
      setReportData(data);
    } catch (err) {
      setError(err.message || 'Error al cargar los reportes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(period);
  }, [period]);

  const periodLabels = {
    day: 'Hoy',
    week: 'Esta Semana',
    month: 'Este Mes',
    year: 'Este Año'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return '#E58A92';
      case 'En preparación': return '#E6A562';
      case 'Listo': return '#617C5A';
      case 'Entregado': return '#79534A';
      case 'Cancelado': return '#9E9E9E';
      default: return 'var(--rose)';
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const maxProductQty = reportData?.top_products?.length
    ? Math.max(...reportData.top_products.map(p => p.total_qty), 1)
    : 1;

  return (
    <div className="reports-page">
      {/* SELECTOR DE PERÍODO */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['day', 'week', 'month', 'year'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                backgroundColor: period === p ? 'var(--rose)' : 'var(--card-bg)',
                color: period === p ? '#fff' : 'var(--text-color)',
                fontWeight: period === p ? '600' : '400',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Calendar size={14} />
              {periodLabels[p]}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => fetchReports(period)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--brown)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px'
          }}
          title="Actualizar métricas"
        >
          <RefreshCw size={14} className={loading ? 'spinning' : ''} />
          Actualizar
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#FDECEA',
          color: '#AD5E65',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading && !reportData ? (
        <div className="empty-state">
          <p>Cargando métricas de {periodLabels[period].toLowerCase()}...</p>
        </div>
      ) : reportData && (
        <>
          {/* TARJETAS DE RESUMEN PRINCIPAL */}
          <div className="summary-cards" style={{ marginBottom: '24px' }}>
            <div className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="metric-label">Facturación ({periodLabels[period]})</span>
                <DollarSign size={20} color="var(--rose)" />
              </div>
              <p className="metric-value">{formatCurrency(reportData.summary.total_revenue)}</p>
              <span className="metric-sub">Suma de pedidos entregados</span>
            </div>

            <div className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="metric-label">Pedidos Entregados</span>
                <PackageCheck size={20} color="#617C5A" />
              </div>
              <p className="metric-value">{reportData.summary.total_orders}</p>
              <span className="metric-sub">Completados en el período</span>
            </div>

            <div className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="metric-label">Ticket Promedio</span>
                <TrendingUp size={20} color="var(--brown)" />
              </div>
              <p className="metric-value">{formatCurrency(reportData.summary.avg_ticket)}</p>
              <span className="metric-sub">Por pedido entregado</span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* RANKING DE PRODUCTOS MÁS VENDIDOS */}
            <div style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              padding: '18px 20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Award size={18} color="var(--rose)" />
                <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--brown)' }}>
                  Más Vendidos ({periodLabels[period]})
                </h3>
              </div>

              {reportData.top_products.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', margin: '20px 0' }}>
                  No se registraron entregas en este período para el ranking.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {reportData.top_products.map((prod, index) => {
                    const percentage = Math.round((prod.total_qty / maxProductQty) * 100);
                    return (
                      <div key={prod.name}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          fontSize: '13px',
                          marginBottom: '4px'
                        }}>
                          <span style={{ fontWeight: '500' }}>
                            <span style={{
                              color: 'var(--rose)',
                              fontWeight: '700',
                              marginRight: '6px'
                            }}>
                              #{index + 1}
                            </span>
                            {prod.name}
                          </span>
                          <span style={{ color: 'var(--brown)', fontWeight: '600' }}>
                            {prod.total_qty} u. ({formatCurrency(prod.total_revenue)})
                          </span>
                        </div>
                        {/* BARRA VISUAL */}
                        <div style={{
                          height: '7px',
                          backgroundColor: '#F3E5E1',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor: 'var(--rose)',
                            borderRadius: '4px',
                            transition: 'width 0.4s ease'
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* DISTRIBUCIÓN POR ESTADOS EN EL PERÍODO */}
            <div style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              padding: '18px 20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <PieChart size={18} color="var(--rose)" />
                <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--brown)' }}>
                  Pedidos Registrados por Estado
                </h3>
              </div>

              {reportData.by_status.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', margin: '20px 0' }}>
                  No hay pedidos programados ni registrados en este período.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {reportData.by_status.map((item) => (
                    <div 
                      key={item.status}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor: '#FFF9F4',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: getStatusColor(item.status)
                        }} />
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                          {item.status}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: 'var(--brown)',
                        backgroundColor: '#F8E8E5',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
