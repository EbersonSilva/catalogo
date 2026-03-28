import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../cart/context/useCart'

export function ProductGrid({ items }) {
  const { addItem, itemCount, getItemQuantity } = useCart()
  const [recentlyAddedId, setRecentlyAddedId] = useState('')
  const [selectedQuantities, setSelectedQuantities] = useState({})

  function getSelectedQuantity(productId) {
    return selectedQuantities[productId] ?? 1
  }

  function changeSelectedQuantity(productId, nextValue) {
    setSelectedQuantities((current) => ({
      ...current,
      [productId]: Math.max(1, nextValue),
    }))
  }

  function handleAdd(product) {
    addItem(product, getSelectedQuantity(product.id))
    setRecentlyAddedId(product.id)
    window.setTimeout(() => {
      setRecentlyAddedId('')
    }, 900)
  }

  if (items.length === 0) {
    return (
      <section className="catalog-empty" role="status" aria-live="polite">
        <h2>Nenhum produto encontrado</h2>
        <p>Tente ajustar os filtros para ampliar os resultados.</p>
      </section>
    )
  }

  return (
    <>
      <div className="catalog-tools">
        <Link to="/carrinho" className="cart-link">
          Carrinho ({itemCount})
        </Link>
      </div>
      <section className="catalog-grid" aria-label="Lista de produtos">
        {items.map((product) => (
          <article key={product.id} className="product-card">
            <Link to={`/catalogo/${product.id}`} className="product-media-link" aria-label={`Abrir detalhes de ${product.name}`}>
              <img src={product.image} alt={product.name} loading="lazy" />
            </Link>
            <span className="product-category">{product.category}</span>
            <h2>
              <Link to={`/catalogo/${product.id}`} className="product-title-link">
                {product.name}
              </Link>
            </h2>
            <p>{product.description}</p>
            <div className="product-meta">
              <strong>R$ {product.price.toFixed(2)}</strong>
              <span>Avaliacao {product.rating}</span>
            </div>
            {getItemQuantity(product.id) > 0 ? (
              <p className="product-in-cart">No carrinho: {getItemQuantity(product.id)}</p>
            ) : null}
            <div className="product-actions">
              <span className={product.inStock ? 'stock in' : 'stock out'}>
                {product.inStock ? 'Disponivel' : 'Sem estoque'}
              </span>
              <div className="product-actions-links">
                <div className="product-qty-controls" aria-label={`Quantidade de ${product.name}`}>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() =>
                      changeSelectedQuantity(product.id, getSelectedQuantity(product.id) - 1)
                    }
                  >
                    -
                  </button>
                  <strong>{getSelectedQuantity(product.id)}</strong>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() =>
                      changeSelectedQuantity(product.id, getSelectedQuantity(product.id) + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  disabled={!product.inStock}
                  className={recentlyAddedId === product.id ? 'added' : ''}
                  onClick={() => handleAdd(product)}
                >
                  {recentlyAddedId === product.id ? 'Adicionado' : 'Adicionar'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
