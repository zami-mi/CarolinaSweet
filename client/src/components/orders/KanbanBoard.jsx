import React from 'react';
import KanbanCard from './KanbanCard';
import { Clock, ChefHat, CheckCircle2, PackageCheck } from 'lucide-react';

const COLUMNS = [
  { id: 'Pendiente', label: 'Pendiente', icon: Clock, colorClass: 'col-pending' },
  { id: 'En preparación', label: 'En preparación', icon: ChefHat, colorClass: 'col-preparing' },
  { id: 'Listo', label: 'Listo para entrega', icon: CheckCircle2, colorClass: 'col-ready' },
  { id: 'Entregado', label: 'Entregado', icon: PackageCheck, colorClass: 'col-delivered' }
];

export default function KanbanBoard({ orders, onOrderClick, onStatusChange, onToggleFavorite }) {
  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => {
        const IconComponent = col.icon;
        const columnOrders = orders.filter(o => o.status === col.id);

        return (
          <div key={col.id} className={`kanban-column ${col.colorClass}`}>
            {/* CABECERA DE LA COLUMNA */}
            <div className="kanban-column-header">
              <div className="column-title-wrap">
                <IconComponent size={16} />
                <h3>{col.label}</h3>
              </div>
              <span className="column-count-badge">{columnOrders.length}</span>
            </div>

            {/* LISTA DE TARJETAS EN ESTA COLUMNA */}
            <div className="kanban-column-cards">
              {columnOrders.length === 0 ? (
                <div className="kanban-empty-column">
                  <p>Sin pedidos en este estado</p>
                </div>
              ) : (
                columnOrders.map((order) => (
                  <KanbanCard
                    key={order.id}
                    order={order}
                    onClick={onOrderClick}
                    onStatusChange={onStatusChange}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
