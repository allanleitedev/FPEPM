#!/bin/bash

# Script de Deploy para Netlify
echo "🚀 Iniciando deploy na Netlify..."

# Verificar se o Netlify CLI está instalado
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI não encontrado. Instalando..."
    npm install -g netlify-cli
fi

# Verificar se está logado
if ! netlify status &> /dev/null; then
    echo "🔐 Faça login na Netlify..."
    netlify login
fi

# Build do projeto
echo "📦 Fazendo build do projeto..."
npm run build:client

# Deploy
echo "🚀 Fazendo deploy..."
netlify deploy --prod --dir=dist/spa

echo "✅ Deploy concluído!"
echo "📝 Configure as variáveis de ambiente no painel da Netlify:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo "   - PING_MESSAGE (opcional)"
