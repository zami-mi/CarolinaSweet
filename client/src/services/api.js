const API_BASE_URL = 'http://localhost:4000/api';

async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Error en la solicitud HTTP (${response.status})`);
  }

  return data;
}

export const api = {
  // Salud
  getHealth: () => fetchJson('/health'),

  // Categorías
  getCategories: () => fetchJson('/categories'),

  // Catálogo de Productos
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category_id) query.append('category_id', params.category_id);
    if (params.available_only) query.append('available_only', 'true');
    if (params.featured_only) query.append('featured_only', 'true');
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson(`/products${queryString}`);
  },

  getProductById: (id) => fetchJson(`/products/${id}`),

  createProduct: (productData) => fetchJson('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),

  updateProduct: (id, productData) => fetchJson(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  }),

  toggleProductAvailability: (id, is_available) => fetchJson(`/products/${id}/availability`, {
    method: 'PATCH',
    body: JSON.stringify({ is_available })
  }),

  deleteProduct: (id) => fetchJson(`/products/${id}`, {
    method: 'DELETE'
  }),

  // Clientes
  getClients: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.include_inactive) query.append('include_inactive', 'true');
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson(`/clients${queryString}`);
  },

  getClientById: (id) => fetchJson(`/clients/${id}`),

  createClient: (clientData) => fetchJson('/clients', {
    method: 'POST',
    body: JSON.stringify(clientData)
  }),

  updateClient: (id, clientData) => fetchJson(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clientData)
  }),

  toggleClientStatus: (id, is_active) => fetchJson(`/clients/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active })
  })
};
