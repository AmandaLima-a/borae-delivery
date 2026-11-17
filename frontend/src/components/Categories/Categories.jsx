import {
  CakeSlice,
  CupSoda,
  Hamburger,
  Pizza,
  Utensils,
  Leaf,
} from 'lucide-react'

import './Categories.css'

const categories = [
  {
    id: 1,
    name: 'Hambúrgueres',
    icon: Hamburger,
  },
  {
    id: 2,
    name: 'Pizzas',
    icon: Pizza,
  },
  {
    id: 3,
    name: 'Combos',
    icon: Utensils,
  },
  {
    id: 4,
    name: 'Bebidas',
    icon: CupSoda,
  },
  {
    id: 5,
    name: 'Sobremesas',
    icon: CakeSlice,
  },
  {
    id: 6,
    name: 'Vegetarianos',
    icon: Leaf,
  },
]

function Categories({ onSelectCategory }) {
  return (
    <section className="categories">
      <div className="categories-header">
        <span className="categories-eyebrow">
          Escolha seu sabor
        </span>

        <h2>
          O que você está com vontade de comer?
        </h2>

        <p>
          Encontre seu próximo pedido favorito.
        </p>
      </div>

      <div className="categories-list">
        {categories.map((category) => {
          const Icon = category.icon

          return (
            <button
              key={category.id}
              type="button"
              className="category-card"
              onClick={() => {
                onSelectCategory(category.name)

                document.getElementById('cardapio')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }}
            >
              <span className="category-icon">
                <Icon size={30} strokeWidth={2} />
              </span>

              <span className="category-name">
                {category.name}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default Categories