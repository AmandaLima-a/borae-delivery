import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'

import api from '../../services/api'
import { productImages } from '../../data/productImages'

import './Products.css'

function Products({
  onAddToCart,
  searchTerm,
  activeCategory,
  setActiveCategory,
}) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get('/products')

        const formattedProducts = response.data.map((product) => ({
          ...product,
          price: Number(product.price),
          image: productImages[product.image],
        }))

        setProducts(formattedProducts)
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        setError('Não foi possível carregar os produtos.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = [
    'Todos',
    'Hambúrgueres',
    'Pizzas',
    'Combos',
    'Bebidas',
    'Sobremesas',
    'Vegetarianos',
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())

    const matchesCategory =
      activeCategory === 'Todos' ||
      (activeCategory === 'Vegetarianos'
        ? product.vegetarian === true
        : product.category === activeCategory)

    return matchesSearch && matchesCategory
  })

  return (
    <section id="cardapio" className="products">
      <div className="products-header">
        <div>
          <span className="products-eyebrow">
            Mais pedidos
          </span>

          <h2>
            Escolha o seu favorito
          </h2>

          <p>
            Alguns dos sabores que fazem sucesso por aqui.
          </p>
        </div>
      </div>

      <div className="products-filters">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`products-filter ${activeCategory === category ? 'active' : ''
              }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="products-empty">Carregando produtos...</p>
      ) : error ? (
        <p className="products-empty">{error}</p>
      ) : filteredProducts.length > 0 ? (
        <div className="products-list">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="product-card"
            >
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                />
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <div className="product-footer">
                  <strong>
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </strong>

                  <button
                    type="button"
                    className="add-button"
                    aria-label={`Adicionar ${product.name} ao carrinho`}
                    onClick={() => onAddToCart(product)}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="products-empty">
          Nenhum produto encontrado. Tente outra busca ou categoria.
        </p>
      )}
    </section>
  )
}

export default Products