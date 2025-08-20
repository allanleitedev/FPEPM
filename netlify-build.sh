#!/bin/bash

# Script de build personalizado para Netlify
echo "🚀 Iniciando build na Netlify..."

# Forçar uso do npm
export NPM_CONFIG_PACKAGE_MANAGER=npm
export NPM_CONFIG_LEGACY_PEER_DEPS=true

# Limpar cache do npm
npm cache clean --force

# Instalar dependências com flags específicas
echo "📦 Instalando dependências..."
npm install --legacy-peer-deps --no-optional

# Build do cliente
echo "🔨 Fazendo build do cliente..."
npm run build:client

echo "✅ Build concluído!"
