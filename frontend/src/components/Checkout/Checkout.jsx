import { useState } from 'react'
import { X } from 'lucide-react'

import api from '../../services/api'

import './Checkout.css'

function Checkout({ cart, cartTotal, onClose, onOrderComplete, onSaveOrder }) {
  const [step, setStep] = useState('form')
  const [orderNumber, setOrderNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('Pix')
  const [needsChange, setNeedsChange] = useState('Não')
  const [changeFor, setChangeFor] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    let formattedValue = value

    if (name === 'cep') {
      formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 8)
        .replace(/^(\d{5})(\d)/, '$1-$2')
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: formattedValue,
    }))
  }

  const searchCEP = async (cep) => {
    const cleanCEP = cep.replace(/\D/g, '')

    if (cleanCEP.length !== 8) return

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCEP}/json/`
      )

      const data = await response.json()

      if (data.erro) {
        alert('CEP não encontrado.')
        return
      }

      setFormData((currentData) => ({
        ...currentData,
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
      }))
    } catch (error) {
      console.error('Erro ao consultar CEP:', error)
      alert('Não foi possível consultar o CEP. Tente novamente.')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setStep('review')
  }

  const handleConfirmOrder = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    const newOrder = {
      id: Date.now(),
      orderNumber: Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      customer: formData,
      items: cart,
      total: cartTotal,
      paymentMethod,
      needsChange,
      changeFor,
      status: 'Pedido recebido',
    }

    try {
      await api.post('/orders', newOrder)

      setOrderNumber(newOrder.orderNumber)
      onSaveOrder(newOrder)
      setStep('success')
    } catch (error) {
      console.error('Erro ao registrar pedido:', error)
      alert('Não foi possível registrar seu pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinishOrder = () => {
    onOrderComplete()
  }

  const handleClose = () => {
    if (step === 'success') {
      onOrderComplete()
      return
    }

    onClose()
  }

  const formatPrice = (price) =>
    `R$ ${price.toFixed(2).replace('.', ',')}`

  return (
    <div className="checkout-overlay" onClick={handleClose}>
      <section
        className="checkout"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="checkout-header">
          <h2>
            {step === 'form'
              ? 'Finalizar pedido'
              : step === 'review'
                ? 'Revise seu pedido'
                : 'Pedido confirmado!'
            }
          </h2>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar checkout"
          >
            <X size={22} />
          </button>
        </div>

        {step === 'form' ? (
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Seus dados</h3>

            <label>
              Nome completo
              <input
                type="text"
                name="name"
                placeholder="Digite seu nome"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Telefone
              <input
                type="tel"
                name="phone"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>

            <h3>Endereço de entrega</h3>

            <label>
              CEP
              <input
                type="text"
                name="cep"
                placeholder="00000-000"
                value={formData.cep}
                onChange={handleChange}
                onBlur={(event) => searchCEP(event.target.value)}
                maxLength={9}
                required
              />
            </label>

            <label>
              Rua/Avenida
              <input
                type="text"
                name="street"
                placeholder="Nome da rua"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </label>

            <div className="checkout-row">
              <label>
                Número
                <input
                  type="text"
                  name="number"
                  placeholder="Nº"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Complemento
                <input
                  type="text"
                  name="complement"
                  placeholder="Apartamento, casa..."
                  value={formData.complement}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              Bairro
              <input
                type="text"
                name="neighborhood"
                placeholder="Seu bairro"
                value={formData.neighborhood}
                onChange={handleChange}
                required
              />
            </label>

            <h3>Forma de pagamento</h3>

            <div className="payment-options">
              {[
                'Pix',
                'Cartão de crédito',
                'Cartão de débito',
                'Dinheiro',
              ].map((method) => (
                <button
                  key={method}
                  type="button"
                  className={`payment-option ${paymentMethod === method ? 'selected' : ''
                    }`}
                  onClick={() => setPaymentMethod(method)}
                >
                  <span className="payment-radio">
                    {paymentMethod === method && <span />}
                  </span>

                  {method}
                </button>
              ))}
            </div>

            {paymentMethod === 'Dinheiro' && (
              <div className="change-options">
                <label>
                  Precisa de troco?
                  <select
                    value={needsChange}
                    onChange={(event) => setNeedsChange(event.target.value)}
                  >
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </label>

                {needsChange === 'Sim' && (
                  <label>
                    Troco para quanto?
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Ex.: 50,00"
                      value={changeFor}
                      onChange={(event) => setChangeFor(event.target.value)}
                      required
                    />
                  </label>
                )}
              </div>
            )}

            <div className="checkout-summary">
              <span>Total do pedido</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>

            <button type="submit" className="checkout-submit">
              Continuar
            </button>
          </form>
        ) : step === 'review' ? (
          <div className="checkout-review">
            <h3>Seus dados</h3>

            <div className="review-section">
              <p><strong>Nome:</strong> {formData.name}</p>
              <p><strong>Telefone:</strong> {formData.phone}</p>
            </div>

            <h3>Endereço de entrega</h3>

            <div className="review-section">
              <p>{formData.street}, {formData.number}</p>

              {formData.complement && <p>{formData.complement}</p>}

              <p>{formData.neighborhood} | CEP: {formData.cep}</p>
            </div>

            <h3>Seu pedido</h3>

            <div className="review-section">
              {cart.map((product) => (
                <div className="review-product" key={product.id}>
                  <span>
                    {product.quantity}x {product.name}
                  </span>

                  {product.observation && (
                    <p className="review-observation">
                      Observação: {product.observation}
                    </p>
                  )}

                  <strong>
                    {formatPrice(product.price * product.quantity)}
                  </strong>
                </div>
              ))}
            </div>

            <h3>Pagamento</h3>

            <div className="review-section">
              <p>{paymentMethod}</p>

              {paymentMethod === 'Dinheiro' && (
                <p>
                  {needsChange === 'Sim'
                    ? `Troco para ${formatPrice(Number(changeFor))}`
                    : 'Não precisa de troco'}
                </p>
              )}
            </div>

            <div className="checkout-summary">
              <span>Total do pedido</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>

            <button
              type="button"
              className="checkout-back"
              onClick={() => setStep('form')}
            >
              Voltar e editar
            </button>

            <button
              type="button"
              className="checkout-submit"
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : 'Confirmar pedido'}
            </button>
          </div>
        ) : (
          <div className="checkout-success">
            <div className="success-icon">
              <span>✓</span>
            </div>

            <h3>Pedido realizado com sucesso!</h3>

            <p>
              Obrigado pela preferência, {formData.name}!
            </p>

            <div className="success-order-number">
              <span>Número do pedido</span>
              <strong>#{orderNumber}</strong>
            </div>

            <p className="success-message">
              Seu pedido foi registrado. Agora é só aguardar!
            </p>

            <button
              type="button"
              className="checkout-submit"
              onClick={handleFinishOrder}
            >
              Voltar ao cardápio
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default Checkout