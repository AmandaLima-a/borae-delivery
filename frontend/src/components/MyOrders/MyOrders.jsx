import {
  Package,
  ArrowLeft,
  ShoppingBag,
  ChefHat,
  Bike,
  CheckCircle2,
  CalendarDays,
  CreditCard,
} from 'lucide-react'
import './MyOrders.css'

function MyOrders({ orders, onBack }) {
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const activeOrder = orders.find(
    (order) => !['Entregue', 'Cancelado'].includes(order.status)
  )

  const previousOrders = orders.filter(
    (order) => order.id !== activeOrder?.id
  )

  const steps = [
    { label: 'Pedido recebido', icon: CheckCircle2 },
    { label: 'Em preparação', icon: ChefHat },
    { label: 'Saiu para entrega', icon: Bike },
    { label: 'Entregue', icon: Package },
  ]

  const getCurrentStep = (status) => {
    const statusSteps = {
      'Pedido recebido': 0,
      'Em preparação': 1,
      'Saiu para entrega': 2,
      Entregue: 3,
    }

    return statusSteps[status] ?? 0
  }

  return (<section className="my-orders"> <div className="my-orders-container"> <button className="orders-back-button" onClick={onBack}> <ArrowLeft size={18} />
    Voltar ao cardápio </button>

    <div className="my-orders-heading">
      <div>
        <span className="orders-eyebrow">ÁREA DO CLIENTE</span>
        <h2>Meus pedidos</h2>
        <p>Acompanhe suas compras e consulte seu histórico.</p>
      </div>

      <div className="orders-heading-icon">
        <ShoppingBag size={30} />
      </div>
    </div>

    {orders.length === 0 ? (
      <div className="orders-empty">
        <div className="orders-empty-icon">
          <ShoppingBag size={36} />
        </div>

        <h3>Você ainda não fez nenhum pedido</h3>
        <p>Quando fizer seu primeiro pedido, ele aparecerá aqui.</p>

        <button onClick={onBack}>
          Explorar cardápio
        </button>
      </div>
    ) : (
      <>
        {activeOrder && (
          <section className="active-order-section">
            <div className="section-title">
              <div>
                <span className="orders-eyebrow">ACOMPANHAMENTO</span>
                <h3>Pedido em andamento</h3>
              </div>

              <span className="active-order-badge">
                <span className="status-dot"></span>
                {activeOrder.status}
              </span>
            </div>

            <article className="active-order-card">
              <div className="active-order-header">
                <div>
                  <span className="order-number-label">
                    Número do pedido
                  </span>
                  <h3>#{activeOrder.orderNumber}</h3>
                </div>

                <div className="active-order-icon">
                  <Package size={28} />
                </div>
              </div>

              <div
                className="order-progress"
                style={{
                  '--progress': `${(getCurrentStep(activeOrder.status) / 3) * 100}%`,
                }}
              >
                {steps.map((step, index) => {
                  const StepIcon = step.icon
                  const currentStep = getCurrentStep(activeOrder.status)
                  const completed = index <= currentStep

                  return (
                    <div
                      className={`progress-step ${completed ? 'completed' : ''} ${index === currentStep ? 'current' : ''}`}
                      key={step.label}
                    >
                      <div className="progress-icon">
                        <StepIcon size={19} />
                      </div>

                      <span>{step.label}</span>
                    </div>
                  )
                })}
              </div>

              <div className="active-order-info">
                <div className="order-info-heading">
                  <h4>Resumo do pedido</h4>
                  <span>
                    {activeOrder.items.reduce((total, item) => total + item.quantity, 0)} itens
                  </span>
                </div>

                <div className="active-order-products">
                  {activeOrder.items.map((item, index) => (
                    <div
                      className="order-product"
                      key={`${item.id}-${index}`}
                    >
                      <div className="order-product-info">
                        <span>
                          {item.quantity}x {item.name}
                        </span>

                        {item.observation && (
                          <small className="order-item-observation">
                            Obs.: {item.observation}
                          </small>
                        )}
                      </div>

                      <strong>
                        {formatPrice(item.price * item.quantity)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="active-order-details">
                  <div>
                    <CalendarDays size={17} />
                    <span>{formatDate(activeOrder.createdAt)}</span>
                  </div>

                  <div>
                    <CreditCard size={17} />
                    <span>{activeOrder.paymentMethod}</span>
                  </div>
                </div>

                <div className="active-order-total">
                  <span>Total do pedido</span>
                  <strong>{formatPrice(activeOrder.total)}</strong>
                </div>
              </div>
            </article>
          </section>
        )}

        <section className="orders-history-section">
          <div className="section-title">
            <div>
              <span className="orders-eyebrow">SUAS COMPRAS</span>
              <h3>Histórico de pedidos</h3>
            </div>

            <span className="orders-count">
              {previousOrders.length} pedidos
            </span>
          </div>

          {previousOrders.length === 0 ? (
            <div className="orders-history-empty">
              <ShoppingBag size={24} />
              <p>Seus pedidos anteriores aparecerão aqui.</p>
            </div>
          ) : (
            <div className="orders-list">
              {previousOrders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div className="order-card-header">
                    <div>
                      <span className="order-number-label">Pedido</span>
                      <h3>#{order.orderNumber}</h3>
                    </div>

                    <span className="order-status">
                      {order.status}
                    </span>
                  </div>

                  <div className="order-date">
                    {formatDate(order.createdAt)}
                  </div>

                  <div className="order-products">
                    {order.items.map((item, index) => (
                      <div
                        className="order-product"
                        key={`${item.id}-${index}`}
                      >
                        <div className="order-product-info">
                          <span>
                            {item.quantity}x {item.name}
                          </span>

                          {item.observation && (
                            <small className="order-item-observation">
                              Obs.: {item.observation}
                            </small>
                          )}
                        </div>

                        <strong>
                          {formatPrice(item.price * item.quantity)}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <span>Total do pedido</span>
                    <strong>{formatPrice(order.total)}</strong>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </>
    )}
  </div>
  </section>
  )
}

export default MyOrders
