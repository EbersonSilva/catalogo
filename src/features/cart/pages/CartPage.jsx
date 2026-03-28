import { Link } from 'react-router-dom'
import { BRAND } from '../../../app/brand'
import { useCart } from '../context/useCart'
import '../styles/cart.css'

const SELLER_WHATSAPP = import.meta.env.VITE_WHATSAPP_SELLER ?? '5511948551437'

export function CartPage() {
  const { items, totalAmount, removeItem, updateQuantity, clearCart } = useCart()

  function handleFinishPurchase() {
    if (!items.length) {
      return
    }

    const summaryLines = items.map((item) => {
      const lineTotal = item.quantity * item.price
      return `- ${item.name} | qtd: ${item.quantity} | subtotal: R$ ${lineTotal.toFixed(2)}`
    })

    const message = [
      'Ola! Quero finalizar este pedido:',
      '',
      ...summaryLines,
      '',
      `Total: R$ ${totalAmount.toFixed(2)}`,
    ].join('\n')

    const whatsappUrl = `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="cart-shell">
      <header className="cart-header">
        <div>
          <div className="brand-badge">
            <img src={BRAND.logo} alt={`Logo ${BRAND.name}`} />
            <strong>{BRAND.name}</strong>
          </div>
          <p className="cart-kicker">Carrinho</p>
          <h1>Revise seus produtos</h1>
        </div>
        <Link to="/catalogo" className="cart-back-link">
          Voltar para o catalogo
        </Link>
      </header>

      {items.length === 0 ? (
        <section className="cart-empty">
          <h2>Seu carrinho esta vazio</h2>
          <p>Adicione produtos no catalogo para iniciar sua compra.</p>
          <Link to="/catalogo">Ir para o catalogo</Link>
        </section>
      ) : (
        <>
          <section className="cart-list" aria-label="Itens do carrinho">
            {items.map((item) => (
              <article key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="cart-item-content">
                  <h2>{item.name}</h2>
                  <p>R$ {item.price.toFixed(2)}</p>
                </div>
                <div className="cart-qty" aria-label={`Quantidade de ${item.name}`}>
                  <span>Qtd</span>
                  <div className="cart-qty-controls">
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label={`Retirar uma unidade de ${item.name}`}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <strong>{item.quantity}</strong>
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label={`Adicionar uma unidade de ${item.name}`}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <strong className="cart-line-total">
                  R$ {(item.quantity * item.price).toFixed(2)}
                </strong>
                <button type="button" className="remove-btn" onClick={() => removeItem(item.id)}>
                  Remover
                </button>
              </article>
            ))}
          </section>

          <section className="cart-summary">
            <p>
              <span>Total</span>
              <strong>R$ {totalAmount.toFixed(2)}</strong>
            </p>
            <div className="cart-summary-actions">
              <button type="button" onClick={clearCart}>
                Limpar carrinho
              </button>
              <button type="button" className="checkout" onClick={handleFinishPurchase}>
                Finalizar compra
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  )
}
