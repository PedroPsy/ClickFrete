#!/bin/bash

# ClickFretes Setup Script
# Este script configura tudo que você precisa para rodar a API

set -e

echo "🚀 Configurando ClickFretes..."
echo ""

# 1. Verificar Node.js
echo "1️⃣     Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em https://nodejs.org"
    exit 1
fi
echo "✅ Node.js $(node -v) encontrado"
echo ""

# 2. Verificar npm
echo "2️⃣  Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado"
    exit 1
fi
echo "✅ npm $(npm -v) encontrado"
echo ""

# 3. Instalar dependências
echo "3️⃣  Instalando dependências..."
npm install
echo "✅ Dependências instaladas"
echo ""

# 4. Verificar .env
echo "4️⃣  Verificando configurações..."
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado"
    echo "📋 Criando .env a partir de .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edite .env com suas credenciais do PostgreSQL"
    echo ""
    echo "Abra o arquivo .env e configure:"
    echo "  - DATABASE_URL"
    echo "  - JWT_SECRET"
    echo ""
fi
echo ""

# 5. Setup Prisma
echo "5️⃣  Configurando banco de dados..."
echo "⚠️  Certifique-se de que PostgreSQL está rodando"
echo ""
read -p "Deseja executar as migrations? (s/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    npm run prisma:migrate
    npm run prisma:generate
    echo "✅ Banco de dados configurado"
else
    echo "⏭️  Pulando migrations"
fi
echo ""

# 6. Construir
echo "6️⃣  Compilando TypeScript..."
npm run build
echo "✅ Compilação concluída"
echo ""

echo "🎉 Configuração concluída!"
echo ""
echo "📚 Próximos passos:"
echo "  1. Editar .env com suas credenciais"
echo "  2. Executar: npm run dev"
echo "  3. Acessar: http://localhost:3333"
echo "  4. Swagger: http://localhost:3333/api/docs"
echo ""
echo "📖 Documentação:"
echo "  - README.md - Visão geral"
echo "  - GUIA_USO.md - Como usar cada endpoint"
echo "  - MELHORIAS.md - O que foi melhorado"
echo "  - ROADMAP.md - Futuras melhorias"
echo ""
