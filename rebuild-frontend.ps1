# Script para reconstruir o frontend Docker
Write-Host "Limpando containers e volumes..." -ForegroundColor Yellow
docker-compose down -v

Write-Host "Removendo node_modules e package-lock.json..." -ForegroundColor Yellow
if (Test-Path "frontend/node_modules") {
    Remove-Item -Recurse -Force "frontend/node_modules"
}
if (Test-Path "frontend/package-lock.json") {
    Remove-Item -Force "frontend/package-lock.json"
}

Write-Host "Reconstruindo containers..." -ForegroundColor Yellow
docker-compose up --build -d

Write-Host "Frontend reconstruído com sucesso!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:5173" -ForegroundColor Cyan 