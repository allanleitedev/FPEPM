# Deploy na Netlify

Este projeto está configurado para ser deployado na Netlify com suporte a Serverless Functions e SPA.

## 🚀 Configuração Rápida

### 1. Deploy via GitHub (Recomendado)

1. **Conecte seu repositório:**
   - Acesse [netlify.com](https://netlify.com)
   - Clique em "New site from Git"
   - Conecte seu repositório GitHub

2. **Configure o build:**
   - **Build command:** `npm run build:client`
   - **Publish directory:** `dist/spa`
   - **Functions directory:** `netlify/functions`

3. **Configure as variáveis de ambiente:**
   - `VITE_SUPABASE_URL` = sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua chave anônima do Supabase
   - `PING_MESSAGE` = pong (opcional)

### 2. Deploy via CLI

```bash
# Windows
.\deploy-netlify.ps1

# Linux/Mac
./deploy-netlify.sh
```

## 📁 Estrutura do Projeto

```
├── netlify/
│   ├── functions/
│   │   ├── api.ts          # API principal (Express)
│   │   ├── ping.ts         # Endpoint de teste
│   │   └── demo.ts         # Endpoint de demonstração
│   └── netlify.toml        # Configuração do deploy
├── dist/spa/               # Build do frontend
└── server/                 # Código do servidor
```

## 🔧 Configuração Detalhada

### netlify.toml

```toml
[build]
  command = "npm run build:client"
  functions = "netlify/functions"
  publish = "dist/spa"

[build.environment]
  NODE_VERSION = "18"

[functions]
  external_node_modules = ["express"]
  node_bundler = "esbuild"
  
[[redirects]]
  force = true
  from = "/api/*"
  status = 200
  to = "/.netlify/functions/api/:splat"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🌐 Endpoints Disponíveis

### Frontend
- **URL Principal:** `https://seu-site.netlify.app`

### API Endpoints
- **API Principal:** `https://seu-site.netlify.app/.netlify/functions/api`
- **Ping:** `https://seu-site.netlify.app/.netlify/functions/ping`
- **Demo:** `https://seu-site.netlify.app/.netlify/functions/demo`

### Rotas Redirecionadas
- **API Routes:** `/api/*` → `/.netlify/functions/api/*`
- **SPA Routes:** `/*` → `/index.html`

## 🔧 Variáveis de Ambiente

Configure no painel da Netlify:

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima do Supabase | ✅ |
| `PING_MESSAGE` | Mensagem do endpoint /api/ping | ❌ |
| `NODE_ENV` | Ambiente (production/development) | ❌ |

## 🛠️ Comandos Úteis

```bash
# Build local
npm run build:client

# Testar funções localmente
netlify dev

# Deploy manual
netlify deploy --prod --dir=dist/spa

# Ver logs
netlify logs
```

## 🔍 Troubleshooting

### Erro de Build
- Verifique se o Node.js 18+ está sendo usado
- Confirme que todas as dependências estão instaladas
- Verifique os logs de build na Netlify

### Erro de API
- Confirme que as funções estão na pasta `netlify/functions/`
- Verifique se o `netlify.toml` está configurado corretamente
- Teste localmente com `netlify dev`

### Erro de SPA
- Confirme que o build está gerando arquivos em `dist/spa/`
- Verifique se o redirect para `index.html` está funcionando

## 📊 Monitoramento

Após o deploy, monitore:
- **Logs de função:** Painel da Netlify → Functions
- **Métricas de performance:** Analytics da Netlify
- **Erros de runtime:** Logs em tempo real
- **Uso de recursos:** Dashboard da Netlify

## 🔄 Deploy Automático

O deploy automático é ativado quando:
- Você faz push para a branch `main`
- Configura webhooks no GitHub
- Usa o painel da Netlify para deploy manual

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs na Netlify
2. Confirme as variáveis de ambiente
3. Teste localmente com `netlify dev`
4. Consulte a documentação da Netlify
