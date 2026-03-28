export function CatalogFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  stockOnly,
  onStockOnlyChange,
  sortBy,
  onSortByChange,
}) {
  return (
    <section className="catalog-filters" aria-label="Filtros do catalogo">
      <label className="field field-search">
        <span>Busca</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nome, descricao ou tag"
        />
      </label>

      <label className="field">
        <span>Categoria</span>
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          {categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Ordenar por</span>
        <select value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
          <option value="relevance">Mais relevantes</option>
          <option value="price-asc">Menor preco</option>
          <option value="price-desc">Maior preco</option>
          <option value="rating">Melhor avaliacao</option>
        </select>
      </label>

      <label className="field-check">
        <input
          type="checkbox"
          checked={stockOnly}
          onChange={(event) => onStockOnlyChange(event.target.checked)}
        />
        <span>Somente em estoque</span>
      </label>
    </section>
  )
}
