import React, { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Users } from 'lucide-react';
import { api } from '../services/api';
import ClientCard from '../components/clients/ClientCard';
import ClientFormModal from '../components/clients/ClientFormModal';
import ClientDetailModal from '../components/clients/ClientDetailModal';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);

  // Modales
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getClients({
        search: searchTerm || undefined,
        include_inactive: includeInactive ? true : undefined
      });
      setClients(res.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [searchTerm, includeInactive]);

  const handleOpenCreate = () => {
    setEditingClient(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setIsFormModalOpen(true);
  };

  const handleOpenDetails = (client) => {
    setSelectedClientId(client.id);
    setIsDetailModalOpen(true);
  };

  const handleSaveClient = async (clientData) => {
    if (editingClient) {
      await api.updateClient(editingClient.id, clientData);
    } else {
      await api.createClient(clientData);
    }
    await loadClients();
  };

  const handleToggleStatus = async (client) => {
    const isDeactivating = client.is_active === 1;
    const confirmAction = window.confirm(
      isDeactivating
        ? `¿Deseas desactivar a ${client.name}? Ocultará al cliente para nuevos pedidos pero conservará su historial intacto.`
        : `¿Deseas reactivar a ${client.name}?`
    );
    if (!confirmAction) return;

    try {
      await api.toggleClientStatus(client.id, isDeactivating ? 0 : 1);
      await loadClients();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  return (
    <div className="clients-page">
      {/* HEADER DE SECCIÓN */}
      <div className="section-header catalog-header">
        <div>
          <p className="eyebrow">AGENDA ARTESANAL</p>
          <h2>Clientes registrados ({clients.length})</h2>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} /> Nuevo cliente
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="catalog-toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar cliente por nombre o teléfono / WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
            />
            <span>Mostrar desactivados</span>
          </label>
        </div>
      </div>

      {/* ESTADOS */}
      {loading && (
        <div className="loading-state">
          <RefreshCw className="spin-icon" size={24} />
          <p>Cargando lista de clientes...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={loadClients}>
            Reintentar
          </button>
        </div>
      )}

      {/* GRILLA DE CLIENTES */}
      {!loading && !error && (
        <>
          {clients.length === 0 ? (
            <div className="empty-state">
              <Users size={32} style={{ color: 'var(--rose)', margin: '0 auto 12px' }} />
              <p>No se encontraron clientes con los filtros aplicados.</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setIncludeInactive(false);
                }}
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="clients-grid">
              {clients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onViewDetails={handleOpenDetails}
                  onEdit={handleOpenEdit}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      <ClientFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveClient}
        client={editingClient}
      />

      {/* MODAL DE HISTORIAL DETALLADO */}
      <ClientDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        clientId={selectedClientId}
      />
    </div>
  );
}
