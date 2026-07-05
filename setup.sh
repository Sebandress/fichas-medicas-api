#!/usr/bin/env bash
set -euo pipefail

echo "== Fichas Médicas - Setup y Run =="

# chequear node
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js no encontrado. Instala Node >= 18 y npm antes de continuar." >&2
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "npm no encontrado. Instala Node >= 18 y npm antes de continuar." >&2
  exit 1
fi

ACTION=${1:-dev}

echo "Instalando dependencias (npm install)..."
npm install

if [ ! -f .env ]; then
  echo "Copiando .env.example -> .env"
  cp .env.example .env
  echo "Recuerda revisar .env y ajustar MONGO_URI/JWT_SECRET si es necesario."
fi

case "$ACTION" in
  dev)
    echo "Iniciando en modo desarrollo (npm run dev)..."
    npm run dev
    ;;
  test)
    echo "Ejecutando tests (npm test)..."
    npm test
    ;;
  build)
    echo "Construyendo proyecto (npm run build)..."
    npm run build
    ;;
  *)
    echo "Uso: $0 [dev|test|build]"
    exit 1
    ;;
esac
