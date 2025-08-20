#!/bin/bash

# Script de build personalizado para Netlify
echo "🚀 Iniciando build na Netlify..."

# Limpar cache do npm
npm cache clean --force

# Instalar dependências com flags específicas
echo "📦 Instalando dependências..."
npm install --legacy-peer-deps --no-optional

# Build do cliente
echo "🔨 Fazendo build do cliente..."
npm run build:client

echo "✅ Build concluído!"
