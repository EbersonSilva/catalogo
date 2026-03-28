import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BRAND } from '../../../app/brand'
import { useCart } from '../../cart/context/useCart'
import { getProductById } from '../services/catalogService'
import '../styles/catalog.css'

export function ProductDetailPage() {
  const { productId } = useParams()
  const { addItem, itemCount, getItemQuantity } = useCart()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  function handleAddToCart() {
    addItem(product, quantity)
    setJustAdded(true)
    window.setTimeout(() => {
      setJustAdded(false)
    }, 900)
  }

  useEffect(() => {
    let isActive = true

    async function loadProduct() {
      if (!productId) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const result = await getProductById(productId)

        if (isActive) {
          setProduct(result)
        }
      } catch {
        if (isActive) {
          setError('Nao foi possivel carregar esse produto agora.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      isActive = false
    }
  }, [productId])

  if (isLoading) {
    return (
      <main className="catalog-shell">
        <p className="catalog-message">Carregando detalhes do produto...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="catalog-shell">
        <section className="catalog-empty">
          <h1>Erro ao carregar</h1>
          <p>{error}</p>
          <Link to="/catalogo">Voltar para o catalogo</Link>
        </section>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="catalog-shell">
        <section className="catalog-empty">
          <h1>Produto nao encontrado</h1>
          <p>Esse item nao existe mais no catalogo de exemplo.</p>
          <Link to="/catalogo">Voltar para o catalogo</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="catalog-shell">
      <header className="catalog-header">
        <div>
          <div className="brand-badge">
            <img src={BRAND.logo} alt={`Logo ${BRAND.name}`} />
            <strong>{BRAND.name}</strong>
          </div>
          <p className="catalog-kicker">Detalhe</p>
          <h1>{product.name}</h1>
          <p className="catalog-subtitle">{product.description}</p>
        </div>
        <Link to="/catalogo" className="back-link">
          Voltar para o catalogo
        </Link>
      </header>

      <div className="catalog-tools">
        <Link to="/carrinho" className="cart-link">
          Carrinho ({itemCount})
        </Link>
      </div>

      <section className="product-detail">
        <img src={product.image} alt={product.name} loading="lazy" />
        <p>
          <strong>Categoria:</strong> {product.category}
        </p>
        <p>
          <strong>Preco:</strong> R$ {product.price.toFixed(2)}
        </p>
        <p>
          <strong>Avaliacao:</strong> {product.rating}
        </p>
        <p>
          <strong>Status:</strong> {product.inStock ? 'Disponivel em estoque' : 'Sem estoque'}
        </p>
        <p>
          <strong>Tags:</strong> {product.tags.join(', ')}
        </p>
        {getItemQuantity(product.id) > 0 ? (
          <p className="product-in-cart">No carrinho: {getItemQuantity(product.id)}</p>
        ) : null}
        <div className="product-detail-actions">
          <div className="product-qty-controls" aria-label={`Quantidade de ${product.name}`}>
            <button
              type="button"
              className="qty-btn"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            >
              -
            </button>
            <strong>{quantity}</strong>
            <button
              type="button"
              className="qty-btn"
              onClick={() => setQuantity((current) => current + 1)}
            >
              +
            </button>
          </div>
          <button
            type="button"
            disabled={!product.inStock}
            className={justAdded ? 'added' : ''}
            onClick={handleAddToCart}
          >
            {justAdded ? 'Adicionado' : 'Adicionar ao carrinho'}
          </button>
        </div>
      </section>
    </main>
  )
}
