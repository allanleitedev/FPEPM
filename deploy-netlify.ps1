# Script de Deploy para Netlify (PowerShell)
Write-Host "🚀 Iniciando deploy na Netlify..." -ForegroundColor Green

# Verificar se o Netlify CLI está instalado
try {
    netlify --version | Out-Null
    Write-Host "✅ Netlify CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Netlify CLI não encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# Verificar se está logado
try {
    netlify status | Out-Null
    Write-Host "✅ Logado na Netlify" -ForegroundColor Green
} catch {
    Write-Host "🔐 Faça login na Netlify..." -ForegroundColor Yellow
    netlify login
}

# Build do projeto
Write-Host "📦 Fazendo build do projeto..." -ForegroundColor Blue
npm run build:client

# Deploy
Write-Host "🚀 Fazendo deploy..." -ForegroundColor Blue
netlify deploy --prod --dir=dist/spa

Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "📝 Configure as variáveis de ambiente no painel da Netlify:" -ForegroundColor Cyan
Write-Host "   - VITE_SUPABASE_URL" -ForegroundColor White
Write-Host "   - VITE_SUPABASE_ANON_KEY" -ForegroundColor White
Write-Host "   - PING_MESSAGE (opcional)" -ForegroundColor White
