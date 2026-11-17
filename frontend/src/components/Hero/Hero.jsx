import { ArrowRight } from 'lucide-react'

import heroFood from '../../assets/hero-food.webp'

import './Hero.css'

function Hero() {
  const goToMenu = () => {
    document.getElementById('cardapio')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-eyebrow">
          Pediu. Chegou. Aproveitou.
        </span>

        <h1>
          Seu pedido favorito,
          <br />
          do seu jeito.
        </h1>

        <p>
          Encontre seus sabores favoritos, monte seu pedido
          e receba onde estiver.
        </p>

        <button 
          type="button" 
          className="hero-button"
          onClick={goToMenu}
        >
          Ver cardápio
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="hero-visual">
        <img
          src={heroFood}
          alt="Hambúrguer, batata frita e refrigerante do Boraê"
        />
      </div>
    </section>
  )
}

export default Hero