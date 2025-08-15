#!/bin/bash

# Script de Deploy para Vercel
echo "🚀 Iniciando deploy na Vercel..."

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Verificar se está logado
if ! vercel whoami &> /dev/null; then
    echo "🔐 Faça login na Vercel..."
    vercel login
fi

# Build do projeto
echo "📦 Fazendo build do projeto..."
npm run build

# Deploy
echo "🚀 Fazendo deploy..."
vercel --prod

echo "✅ Deploy concluído!"
echo "📝 Configure as variáveis de ambiente no painel da Vercel:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo "   - PING_MESSAGE (opcional)"
