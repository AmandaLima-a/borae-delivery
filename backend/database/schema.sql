-- ========================================
-- TABELA DE PRODUTOS
-- ========================================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    vegetarian BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ========================================
-- TABELA DE PEDIDOS
-- ========================================

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number INTEGER NOT NULL UNIQUE,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    street VARCHAR(150) NOT NULL,
    address_number VARCHAR(20) NOT NULL,
    complement VARCHAR(100),
    neighborhood VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    needs_change VARCHAR(5),
    change_for NUMERIC(10, 2),
    total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pedido recebido',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ========================================
-- TABELA DE ITENS DOS PEDIDOS
-- ========================================

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(150) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    observation TEXT
);