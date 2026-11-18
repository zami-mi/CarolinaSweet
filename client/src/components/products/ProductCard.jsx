import React from 'react';
import { Sparkles, Eye, EyeOff, Edit3, Trash2 } from 'lucide-react';

export default function ProductCard({ product, onEdit, onToggleAvailability, onDelete }) {
  const isAvailable = product.is_available === 1;
  const isFeatured = product.is_featured === 1;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  const allergensList = product.allergens
    ? product.allergens.split(',').map(a => a.trim()).filter(Boolean)
    : [];

  return (
    <article className={`product-card ${!isAvailable ? 'product-card-paused' : ''}`}>
      {/* IMAGEN DECORATIVA */}
      <div className="product-image-container">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-image" />
        ) : (
          <div className="product-image-placeholder">🍰</div>
        )}

        <div className="product-badges">
          {isFeatured && (
            <span className="badge badge-featured">
              <Sparkles size={12} /> Destacado
            </span>
          )}
          <span className={`badge ${isAvailable ? 'badge-available' : 'badge-paused'}`}>
            {isAvailable ? 'Disponible' : 'Pausado'}
          </span>
        </div>
      </div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className="product-info">
        <span className="product-category">{product.category_name || 'Pastelería'}</span>
        <h3 className="product-title">{product.name}</h3>

        {product.description && (
          <p className="product-description">{product.description}</p>
        )}

        {/* ALÉRGENOS */}
        {allergensList.length > 0 && (
          <div className="product-allergens">
            {allergensList.map((allergen, idx) => (
              <span key={idx} className="allergen-pill">
                {allergen}
              </span>
            ))}
          </div>
        )}

        {/* PRECIO Y ACCIONES */}
        <div className="product-footer">
          <div className="product-price">
            <span className="price-label">Precio base</span>
            <strong>{formatPrice(product.base_price)}</strong>
          </div>

          <div className="product-actions">
            <button
              type="button"
              className="action-btn"
              title={isAvailable ? 'Pausar disponibilidad' : 'Habilitar para pedidos'}
              onClick={() => onToggleAvailability(product)}
            >
              {isAvailable ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              type="button"
              className="action-btn"
              title="Editar producto"
              onClick={() => onEdit(product)}
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              className="action-btn action-btn-danger"
              title="Eliminar producto"
              onClick={() => onDelete(product)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
