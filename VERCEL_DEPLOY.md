# Deploy na Vercel

Este projeto está configurado para ser deployado na Vercel com suporte a API routes e SPA.

## Configuração Necessária

### 1. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no painel da Vercel:

```bash
# Supabase (Obrigatório)
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Server (Opcional)
PING_MESSAGE=pong

# Strapi (Opcional)
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_TOKEN=seu_token_do_strapi
```

### 2. Configuração do Projeto

O arquivo `vercel.json` já está configurado para:
- Build do cliente React (SPA)
- Build do servidor Express (API routes)
- Roteamento correto entre API e SPA

## Passos para Deploy

### Opção 1: Deploy via GitHub (Recomendado)

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. A Vercel detectará automaticamente a configuração e fará o deploy

### Opção 2: Deploy via CLI

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Para produção:
```bash
vercel --prod
```

## Estrutura do Deploy

- **Frontend**: Build estático em `dist/spa/`
- **API Routes**: Servidor Express em `dist/server/node-build.mjs`
- **Roteamento**: 
  - `/api/*` → API routes
  - `/*` → SPA (index.html)

## Troubleshooting

### Erro de Build
- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme que o Supabase está acessível
- Verifique os logs de build na Vercel

### Erro de API
- Confirme que as rotas `/api/*` estão funcionando
- Verifique se o servidor Express está sendo buildado corretamente

### Erro de SPA
- Confirme que o build do cliente está gerando os arquivos em `dist/spa/`
- Verifique se o roteamento está configurado corretamente

## Comandos de Build

O projeto usa os seguintes comandos de build:

```bash
# Build completo (cliente + servidor)
npm run build

# Build apenas do cliente
npm run build:client

# Build apenas do servidor
npm run build:server
```

## Monitoramento

Após o deploy, monitore:
- Logs de função na Vercel
- Métricas de performance
- Erros de runtime
- Uso de recursos
