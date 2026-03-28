import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BRAND } from '../../../app/brand'
import { CatalogFilters } from '../components/CatalogFilters'
import { ProductGrid } from '../components/ProductGrid'
import { categories } from '../data/products'
import { listProducts } from '../services/catalogService'
import '../styles/catalog.css'

const PER_PAGE = 6

const VALID_SORTS = new Set(['relevance', 'price-asc', 'price-desc', 'rating'])

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const search = searchParams.get('q') ?? ''
  const categoryValues = useMemo(() => new Set(categories.map((item) => item.value)), [])
  const category = categoryValues.has(searchParams.get('category'))
    ? searchParams.get('category')
    : 'all'
  const stockOnly = searchParams.get('stockOnly') === 'true'
  const sortBy = VALID_SORTS.has(searchParams.get('sort'))
    ? searchParams.get('sort')
    : 'relevance'
  const pageFromUrl = Number(searchParams.get('page'))
  const page = Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? Math.floor(pageFromUrl) : 1

  const updateParams = useCallback((nextState, resetPage = true) => {
    setSearchParams((prevParams) => {
      const next = new URLSearchParams(prevParams)

    const nextSearch = nextState.search ?? search
    const nextCategory = nextState.category ?? category
    const nextStockOnly = nextState.stockOnly ?? stockOnly
    const nextSortBy = nextState.sortBy ?? sortBy
    const nextPage = nextState.page ?? (resetPage ? 1 : page)

      if (nextSearch) {
        next.set('q', nextSearch)
      } else {
        next.delete('q')
      }

      if (nextCategory !== 'all') {
        next.set('category', nextCategory)
      } else {
        next.delete('category')
      }

      if (nextStockOnly) {
        next.set('stockOnly', 'true')
      } else {
        next.delete('stockOnly')
      }

      if (nextSortBy !== 'relevance') {
        next.set('sort', nextSortBy)
      } else {
        next.delete('sort')
      }

      if (nextPage > 1) {
        next.set('page', String(nextPage))
      } else {
        next.delete('page')
      }

      return next
    }, { replace: true })
  }, [category, page, search, setSearchParams, sortBy, stockOnly])

  useEffect(() => {
    let isActive = true

    async function loadProducts() {
      setIsLoading(true)
      setError('')

      try {
        const result = await listProducts({
          page,
          perPage: PER_PAGE,
          search,
          category,
          stockOnly,
          sortBy,
        })

        if (isActive) {
          setProducts(result.items)
          setTotalItems(result.total)
          setTotalPages(result.totalPages)

          if (page > result.totalPages) {
            updateParams({ page: result.totalPages }, false)
          }
        }
      } catch {
        if (isActive) {
          setError('Nao foi possivel carregar os produtos agora.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isActive = false
    }
  }, [category, page, search, sortBy, stockOnly, updateParams])

  return (
    <main className="catalog-shell">
      <header className="catalog-header">
        <div>
          <div className="brand-badge">
            <img src={BRAND.logo} alt={`Logo ${BRAND.name}`} />
            <strong>{BRAND.name}</strong>
          </div>
          <p className="catalog-kicker">Catalogo</p>
          <h1>Produtos para testar sua vitrine</h1>
          <p className="catalog-subtitle">
            Essa pagina ja nasce com busca, filtros e estado local para evoluir com API depois.
          </p>
        </div>
      </header>

      <CatalogFilters
        search={search}
        onSearchChange={(value) => updateParams({ search: value })}
        category={category}
        onCategoryChange={(value) => updateParams({ category: value })}
        categories={categories}
        stockOnly={stockOnly}
        onStockOnlyChange={(value) => updateParams({ stockOnly: value })}
        sortBy={sortBy}
        onSortByChange={(value) => updateParams({ sortBy: value })}
      />

      {isLoading ? <p className="catalog-message">Carregando produtos...</p> : null}
      {error ? <p className="catalog-message error">{error}</p> : null}

      {!isLoading && !error ? (
        <>
          <p className="catalog-count">
            Mostrando {products.length} de {totalItems} item(ns)
          </p>
          <ProductGrid items={products} />

          <nav className="catalog-pagination" aria-label="Paginacao de produtos">
            <button
              type="button"
              onClick={() => updateParams({ page: page - 1 }, false)}
              disabled={page <= 1}
            >
              Anterior
            </button>
            <span>
              Pagina {page} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() => updateParams({ page: page + 1 }, false)}
              disabled={page >= totalPages}
            >
              Proxima
            </button>
          </nav>
        </>
      ) : null}
    </main>
  )
}
