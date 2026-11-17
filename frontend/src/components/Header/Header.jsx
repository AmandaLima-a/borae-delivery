import { useEffect, useState } from 'react'
import { Search, ShoppingCart, Menu, X } from 'lucide-react'

import logo from '../../assets/borae-logo.svg'

import './Header.css'

function Header({
  cartQuantity,
  onOpenCart,
  searchTerm,
  onSearchChange,
  onOpenOrders,
  onOpenHome,
}) {

  const [scrolled, setScrolled] = useState(false)

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={`header ${scrolled ? 'header-scrolled' : ''}`}
    >
      <a href="/" className="logo">
        <img src={logo} alt="Boraê" />
      </a>

      <nav className={`navigation ${isMenuOpen ? 'navigation-open' : ''}`}>
        <button
          type="button"
          onClick={() => {
            onOpenHome()
            setIsMenuOpen(false)
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          }}
        >
          Início
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenHome()
            setIsMenuOpen(false)
            setTimeout(() => {
              document.getElementById('cardapio')?.scrollIntoView({
                behavior: 'smooth',
              })
            }, 100)
          }}
        >
          Cardápio
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenOrders()
            setIsMenuOpen(false)
          }}
        >
          Meus pedidos
        </button>
      </nav>

      <div className="actions">
        {isSearchOpen && (
          <input
            type="search"
            className="search-input"
            placeholder="Buscar no cardápio..."
            aria-label="Buscar produtos no cardápio"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            autoFocus
          />
        )}

        <button
          type="button"
          aria-label={isSearchOpen ? 'Fechar busca' : 'Abrir busca'}
          onClick={() => {
            setIsSearchOpen((current) => !current)

            if (isSearchOpen) {
              onSearchChange('')
            }
          }}
        >
          <Search size={22} />
        </button>

        <button
          type="button"
          className="cart-button"
          aria-label={`Carrinho com ${cartQuantity} produtos`}
          onClick={onOpenCart}
        >
          <ShoppingCart size={22} />

          {cartQuantity > 0 && (
            <span className="cart-count">
              {cartQuantity}
            </span>
          )}
        </button>

        <button
          type="button"
          className="menu-toggle"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  )
}

export default Header