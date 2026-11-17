import { useEffect, useState } from 'react'
import api from './services/api'

import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Categories from './components/Categories/Categories'
import Products from './components/Products/Products'
import Cart from './components/Cart/Cart'
import Checkout from './components/Checkout/Checkout'
import MyOrders from './components/MyOrders/MyOrders'

function getSavedList(key) {
  try {
    const savedData = localStorage.getItem(key)

    if (!savedData) return []

    const parsedData = JSON.parse(savedData)

    return Array.isArray(parsedData) ? parsedData : []
  } catch (error) {
    console.error(`Erro ao recuperar ${key}:`, error)
    return []
  }
}

function App() {
  const [cart, setCart] = useState(() => getSavedList('borae-cart'))
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const [orders, setOrders] = useState(() => getSavedList('borae-orders'))

  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')

  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders')
        setOrders(response.data)
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('borae-orders', JSON.stringify(orders))
    } catch (error) {
      console.error('Erro ao salvar pedidos:', error)
    }
  }, [orders])

  useEffect(() => {
    try {
      localStorage.setItem('borae-cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error)
    }
  }, [cart])

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      )

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ]
    })
  }

  const updateCartObservation = (productId, observation) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? { ...item, observation }
          : item
      )
    )
  }

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const cartQuantity = cart.reduce(
    (total, product) => total + product.quantity,
    0
  )

  const cartTotal = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  )

  const openCart = () => {
    setIsCartOpen(true)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  const openCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  const closeCheckout = () => {
    setIsCheckoutOpen(false)
  }

  const clearCart = () => {
    setCart([])
  }

  const finishOrder = () => {
    setCart([])
    setIsCheckoutOpen(false)
  }

  const saveOrder = (newOrder) => {
    setOrders((prevOrders) => [newOrder, ...prevOrders])
  }

  return (
    <>
      <Header
        cart={cart}
        cartQuantity={cartQuantity}
        onOpenCart={openCart}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenOrders={() => setCurrentPage('orders')}
        onOpenHome={() => setCurrentPage('home')}
      />

      {currentPage === 'home' ? (
        <>
          <Hero />
          <Categories onSelectCategory={setActiveCategory} />
          <Products
            onAddToCart={addToCart}
            searchTerm={searchTerm}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </>
      ) : (
        <MyOrders
          orders={orders}
          onBack={() => setCurrentPage('home')}
        />
      )}
      {isCartOpen && (
        <Cart
          cart={cart}
          cartTotal={cartTotal}
          onCloseCart={closeCart}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onClearCart={clearCart}
          onCheckout={openCheckout}
          onUpdateObservation={updateCartObservation}
        />
      )}

      {isCheckoutOpen && (
        <Checkout
          cart={cart}
          cartTotal={cartTotal}
          onClose={closeCheckout}
          onOrderComplete={finishOrder}
          onSaveOrder={saveOrder}
        />
      )}
    </>
  )
}

export default App