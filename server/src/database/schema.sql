

-- 1. Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Clientes habituales
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    notes TEXT,
    allergies TEXT,
    is_active INTEGER DEFAULT 1, -- 1: Activo, 0: Desactivado (baja lógica)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categorías de productos
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

-- 4. Catálogo de productos
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    base_price REAL NOT NULL CHECK(base_price >= 0),
    image_url TEXT,
    allergens TEXT,
    is_available INTEGER DEFAULT 1, -- 1: Disponible, 0: Pausado
    is_featured INTEGER DEFAULT 0,  -- 1: Destacado, 0: Normal
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Pedidos
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
    occasional_name TEXT,
    occasional_phone TEXT,
    status TEXT CHECK(status IN ('Pendiente', 'En preparación', 'Listo', 'Entregado', 'Cancelado')) DEFAULT 'Pendiente',
    delivery_date TEXT NOT NULL,
    delivery_time TEXT,
    customer_notes TEXT,
    subtotal REAL NOT NULL DEFAULT 0,
    custom_additionals_concept TEXT,
    custom_additionals_amount REAL NOT NULL DEFAULT 0,
    total_price REAL NOT NULL DEFAULT 0,
    deposit_paid REAL NOT NULL DEFAULT 0,
    balance_pending REAL NOT NULL DEFAULT 0,
    is_favorite INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    delivered_at DATETIME,
    cancelled_at DATETIME
);

-- 6. Ítems de pedidos
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    unit_price REAL NOT NULL CHECK(unit_price >= 0),
    subtotal REAL NOT NULL CHECK(subtotal >= 0)
);

-- Índices para optimización de consultas
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_orders_occasional_phone ON orders(occasional_phone);
