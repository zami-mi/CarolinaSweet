import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import ProductFormModal from '../components/products/ProductFormModal';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [catsRes, prodsRes] = await Promise.all([
        api.getCategories(),
        api.getProducts({
          category_id: selectedCategory || undefined,
          available_only: onlyAvailable ? true : undefined
        })
      ]);

      setCategories(catsRes.data || []);
      setProducts(prodsRes.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar el catálogo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, onlyAvailable]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      await api.updateProduct(editingProduct.id, productData);
    } else {
      await api.createProduct(productData);
    }
    await loadData();
  };

  const handleToggleAvailability = async (product) => {
    try {
      const nextStatus = product.is_available === 1 ? 0 : 1;
      await api.toggleProductAvailability(product.id, nextStatus);
      await loadData();
    } catch (err) {
      alert(err.message || 'No se pudo cambiar la disponibilidad');
    }
  };

  const handleDeleteProduct = async (product) => {
    const confirmDelete = window.confirm(
      `¿Deseas eliminar "${product.name}"? Si ya fue solicitado en pedidos anteriores, se pausará para proteger el historial contable.`
    );
    if (!confirmDelete) return;

    try {
      const result = await api.deleteProduct(product.id);
      if (result.soft_deleted) {
        alert(result.message);
      }
      await loadData();
    } catch (err) {
      alert(err.message || 'Error al eliminar el producto');
    }
  };

  // Filtrado en memoria por término de búsqueda
  const filteredProducts = products.filter((prod) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      prod.name.toLowerCase().includes(term) ||
      (prod.description && prod.description.toLowerCase().includes(term)) ||
      (prod.category_name && prod.category_name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="catalog-page">
      {/* HEADER DE SECCIÓN */}
      <div className="section-header catalog-header">
        <div>
          <p className="eyebrow">NUESTRAS CREACIONES</p>
          <h2>Catálogo de productos ({filteredProducts.length})</h2>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleOpenCreateModal}>
          <Plus size={16} /> Agregar producto
        </button>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="catalog-toolbar">
        {/* BUSCADOR */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, sabor o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* PILLS DE CATEGORÍAS */}
        <div className="category-pills">
          <button
            type="button"
            className={`pill ${selectedCategory === '' ? 'pill-active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`pill ${selectedCategory === String(cat.id) ? 'pill-active' : ''}`}
              onClick={() => setSelectedCategory(String(cat.id))}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* TOGGLE SOLO DISPONIBLES */}
        <div className="toolbar-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            <span>Solo disponibles</span>
          </label>
        </div>
      </div>

      {/* ESTADOS DE CARGA Y ERROR */}
      {loading && (
        <div className="loading-state">
          <RefreshCw className="spin-icon" size={24} />
          <p>Cargando catálogo artesanal...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={loadData}>
            Reintentar
          </button>
        </div>
      )}

      {/* GRILLA DE PRODUCTOS */}
      {!loading && !error && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>No se encontraron productos con los filtros seleccionados.</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedCategory('');
                  setOnlyAvailable(false);
                  setSearchTerm('');
                }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onEdit={handleOpenEditModal}
                  onToggleAvailability={handleToggleAvailability}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
      />
    </div>
  );
}
