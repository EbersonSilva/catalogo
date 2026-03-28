# Catalogo

Projeto React com Vite preparado para crescer por features.

## Scripts

- `npm run dev`: inicia o ambiente de desenvolvimento
- `npm run api`: sobe a API fake local em `http://localhost:3000`
- `npm run dev:full`: sobe API fake + frontend juntos
- `npm run build`: gera build de producao
- `npm run lint`: valida padroes de codigo

## Camada de servicos

A feature de catalogo usa uma camada de servicos dedicada:

- `src/features/catalog/services/catalogService.js`

Comportamento atual:

- Se `VITE_API_BASE_URL` estiver configurada, os dados sao buscados via `fetch`.
- Se `VITE_API_BASE_URL` nao existir, o app usa fallback local com mocks.

### Endpoints esperados

- `GET /products`
- `GET /products/:id`

Parametros de query usados na listagem:

- `q`: texto de busca
- `category`: categoria exata
- `stockOnly=true`: filtra itens em estoque
- `sort`: `relevance`, `price-asc`, `price-desc`, `rating`
- `page`: pagina atual

Exemplo de variavel de ambiente em `.env`:

`VITE_API_BASE_URL=http://localhost:3000`

Para facilitar, existe um exemplo pronto em `.env.example`.

## Rodando com servico fake

1. Crie o arquivo `.env` com base no `.env.example`.
2. Rode `npm run dev:full`.
3. A aplicacao vai consumir os endpoints locais de `db.json` via json-server.
