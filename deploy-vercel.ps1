# Script de Deploy para Vercel (PowerShell)
Write-Host "🚀 Iniciando deploy na Vercel..." -ForegroundColor Green

# Verificar se o Vercel CLI está instalado
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI não encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g vercel
}

# Verificar se está logado
try {
    vercel whoami | Out-Null
    Write-Host "✅ Logado na Vercel" -ForegroundColor Green
} catch {
    Write-Host "🔐 Faça login na Vercel..." -ForegroundColor Yellow
    vercel login
}

# Build do projeto
Write-Host "📦 Fazendo build do projeto..." -ForegroundColor Blue
npm run build

# Deploy
Write-Host "🚀 Fazendo deploy..." -ForegroundColor Blue
vercel --prod

Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "📝 Configure as variáveis de ambiente no painel da Vercel:" -ForegroundColor Cyan
Write-Host "   - VITE_SUPABASE_URL" -ForegroundColor White
Write-Host "   - VITE_SUPABASE_ANON_KEY" -ForegroundColor White
Write-Host "   - PING_MESSAGE (opcional)" -ForegroundColor White
