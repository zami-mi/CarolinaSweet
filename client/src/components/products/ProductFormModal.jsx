import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';

export default function ProductFormModal({ isOpen, onClose, onSave, product, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    base_price: '',
    description: '',
    image_url: '',
    allergens: '',
    is_available: 1,
    is_featured: 0
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category_id: product.category_id || '',
        base_price: product.base_price !== undefined ? product.base_price : '',
        description: product.description || '',
        image_url: product.image_url || '',
        allergens: product.allergens || '',
        is_available: product.is_available !== undefined ? product.is_available : 1,
        is_featured: product.is_featured !== undefined ? product.is_featured : 0
      });
    } else {
      setFormData({
        name: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        base_price: '',
        description: '',
        image_url: '',
        allergens: '',
        is_available: 1,
        is_featured: 0
      });
    }
    setError('');
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('El nombre del producto es obligatorio');
      return;
    }

    const price = Number(formData.base_price);
    if (isNaN(price) || price < 0) {
      setError('Por favor ingresá un precio válido mayor o igual a 0');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        ...formData,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        base_price: price,
        is_available: formData.is_available ? 1 : 0,
        is_featured: formData.is_featured ? 1 : 0
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="eyebrow">CATÁLOGO ARTESANAL</span>
            <h2>{product ? 'Editar producto' : 'Nuevo producto'}</h2>
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
            <label htmlFor="prod-name">Nombre del producto *</label>
            <input
              id="prod-name"
              type="text"
              required
              placeholder="Ej. Torta Rogel artesanal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prod-category">Categoría</label>
              <select
                id="prod-category"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="">Sin categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prod-price">Precio base ($) *</label>
              <input
                id="prod-price"
                type="number"
                min="0"
                step="100"
                required
                placeholder="Ej. 25000"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prod-desc">Descripción artesanal</label>
            <textarea
              id="prod-desc"
              rows="3"
              placeholder="Detallá los sabores, bizcochuelo, rellenos y cobertura..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prod-image">URL de imagen referencial</label>
            <input
              id="prod-image"
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prod-allergens">Alérgenos (separados por coma)</label>
            <input
              id="prod-allergens"
              type="text"
              placeholder="Ej. Gluten, Huevos, Lácteos, Frutos secos"
              value={formData.allergens}
              onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
            />
          </div>

          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_available === 1}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked ? 1 : 0 })}
              />
              <span>Disponible para nuevos pedidos</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_featured === 1}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} color="var(--rose)" /> Producto destacado
              </span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : (product ? 'Guardar cambios' : 'Crear producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
