import { X, Trash2 } from 'lucide-react'

import './Cart.css'

function Cart({
  cart,
  cartTotal,
  onCloseCart,
  onIncrease,
  onDecrease,
  onClearCart,
  onCheckout,
  onUpdateObservation,
}) {
  return (
    <div className="cart-overlay" onClick={onCloseCart}>
      <aside
        className="cart"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cart-header">
          <h2>Seu carrinho</h2>

          {cart.length > 0 && (
            <button
              type="button"
              className="cart-clear"
              onClick={onClearCart}
              aria-label="Limpar carrinho"
              title="Limpar carrinho"
            >
              <Trash2 size={19} />
            </button>
          )}

          <button
            type="button"
            className="cart-close"
            onClick={onCloseCart}
            aria-label="Fechar carrinho"
          >
            <X size={22} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span>🛒</span>

              <h3>Seu carrinho está vazio</h3>

              <p>
                Adicione alguns sabores deliciosos para começar.
              </p>

              <button
                type="button"
                className="continue-shopping"
                onClick={() => {
                  onCloseCart()

                  document.getElementById('cardapio')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                }}
              >
                Voltar ao cardápio
              </button>
            </div>
          ) : (
            cart.map((product) => (
              <div key={product.id} className="cart-item">
                <div className="cart-item-top">
                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <div className="cart-item-info">
                    <h3>{product.name}</h3>

                    <strong>
                      R$ {(product.price * product.quantity).toFixed(2).replace('.', ',')}
                    </strong>

                    <span className="cart-item-unit-price">
                      R$ {product.price.toFixed(2).replace('.', ',')} cada
                    </span>
                  </div>
                </div>

                <label className="cart-observation">
                  <span>Observações deste item</span>

                  <textarea
                    placeholder="Ex.: sem cebola, sem tomate..."
                    maxLength={150}
                    value={product.observation || ''}
                    onChange={(event) =>
                      onUpdateObservation(product.id, event.target.value)
                    }
                  />

                  <small>
                    {(product.observation || '').length}/150 caracteres
                  </small>
                </label>

                <div className="cart-item-bottom">
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => onDecrease(product.id)}
                      aria-label={`Diminuir quantidade de ${product.name}`}
                    >
                      −
                    </button>

                    <span>{product.quantity}</span>

                    <button
                      type="button"
                      onClick={() => onIncrease(product.id)}
                      aria-label={`Aumentar quantidade de ${product.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>

              <strong>
                R$ {cartTotal.toFixed(2).replace('.', ',')}
              </strong>
            </div>

            <button
              type="button"
              className="continue-shopping"
              onClick={() => {
                onCloseCart()

                document.getElementById('cardapio')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }}
            >
              Continuar comprando
            </button>

            <button
              type="button"
              className="checkout-button"
              onClick={onCheckout}
            >
              Finalizar pedido
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

export default Cart