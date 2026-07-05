param(
  [string]$Action = 'dev'
)

Write-Host "== Fichas Médicas - Setup y Run =="

function Ensure-Command($name) {
  $cmd = Get-Command $name -ErrorAction SilentlyContinue
  if (-not $cmd) {
    Write-Error "$name no encontrado. Instala Node >=18 y npm antes de continuar."
    exit 1
  }
}

Ensure-Command node
Ensure-Command npm

Write-Host "Instalando dependencias (npm install)..."
npm install

if (-not (Test-Path -Path .env)) {
  Write-Host "Copiando .env.example -> .env"
  Copy-Item .env.example .env
  Write-Host "Recuerda revisar .env y ajustar MONGO_URI/JWT_SECRET si es necesario."
}

switch ($Action) {
  'dev' { Write-Host "Iniciando en modo desarrollo (npm run dev)..."; npm run dev }
  'test' { Write-Host "Ejecutando tests (npm test)..."; npm test }
  'build' { Write-Host "Construyendo proyecto (npm run build)..."; npm run build }
  default { Write-Host "Uso: .\setup.ps1 [-Action dev|test|build]" }
}
