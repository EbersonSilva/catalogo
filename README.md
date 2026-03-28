# Catalogo

Aplicacao React (Vite) para vitrine de produtos/servicos com:

- listagem com filtros e busca
- detalhe do item
- carrinho com controle de quantidade
- finalizacao via WhatsApp com resumo do pedido

## Stack

- React 19
- React Router
- CSS por feature (sem Tailwind)
- Vite

## Scripts

- `npm run dev`: inicia o frontend
- `npm run api`: sobe API fake local em `http://localhost:3000`
- `npm run dev:full`: sobe API fake + frontend juntos
- `npm run build`: build de producao
- `npm run lint`: validacao de lint
- `npm run preview`: preview local da build

## Rotas da aplicacao

- `/`: catalogo principal
- `/catalogo/:productId`: detalhe de item
- `/carrinho`: carrinho

## Configuracao da marca

Troque nome e logo do cliente em:

- `src/app/brand.js`

Exemplo:

- `name`: nome exibido no topo das telas
- `logo`: caminho da imagem em `public/` (exemplo: `/logo-cliente.svg`)

## Produtos e fotos

Dados dos itens:

- `src/features/catalog/data/products.js`

Arquivos de imagem:

- `public/products/`

Cada item usa o campo `image`, por exemplo:

- `/products/pulse-headset.svg`

## Finalizacao por WhatsApp

No carrinho, o botao "Finalizar compra" abre o WhatsApp do vendedor com resumo do pedido.

Variavel recomendada:

- `VITE_WHATSAPP_SELLER=5511999999999`

Defina em arquivo `.env` para desenvolvimento e em Environment Variables no Vercel para producao.

## Camada de servico e fallback

Servico do catalogo:

- `src/features/catalog/services/catalogService.js`

Comportamento:

- Se `VITE_API_BASE_URL` existir e a API responder, usa dados remotos
- Se a API falhar ou estiver offline, cai automaticamente para dados locais (`products.js`)

## API fake opcional

Base local:

- `db.json`

Endpoints:

- `GET /products`
- `GET /products/:id`

## Deploy no Vercel

Passo a passo rapido:

1. Importar o repositorio no Vercel
2. Framework: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configurar variaveis de ambiente (principalmente `VITE_WHATSAPP_SELLER`)
6. Deploy

## Estrutura principal

- `src/app/`: configuracoes globais e rotas
- `src/features/catalog/`: listagem, detalhe, filtros e servico
- `src/features/cart/`: contexto, pagina e estilos do carrinho
- `public/products/`: imagens dos itens
