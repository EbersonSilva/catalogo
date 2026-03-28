import { Navigate, Route, Routes } from 'react-router-dom'
import { CatalogPage } from '../features/catalog/pages/CatalogPage'
import { CartPage } from '../features/cart/pages/CartPage'
import { ProductDetailPage } from '../features/catalog/pages/ProductDetailPage'
import { NotFoundPage } from '../pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/catalogo" element={<Navigate to="/" replace />} />
      <Route path="/catalogo/:productId" element={<ProductDetailPage />} />
      <Route path="/carrinho" element={<CartPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
