# ============================================================
# setup-github.ps1 - Sube el proyecto Mini Jira a GitHub
# Ejecutar: .\setup-github.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$repo = "C:\MyCodeGit\Clasefront"

Write-Host "`n=== Setup GitHub - Mini Jira ===" -ForegroundColor Cyan

# 1. Verificar git instalado
try { $gitVersion = git version } catch { Write-Error "Git no encontrado. Instalar desde https://git-scm.com"; exit 1 }
Write-Host "OK: $gitVersion" -ForegroundColor Green

# 2. Inicializar repo local
Set-Location $repo
if (Test-Path ".git") {
    Write-Host "Ya existe un repo git local. Omitiendo git init." -ForegroundColor Yellow
} else {
    git init
    Write-Host "OK: Repo local inicializado" -ForegroundColor Green
}

# 3. Verificar config de usuario git
$gitUser  = git config user.name  2>$null
$gitEmail = git config user.email 2>$null
if (-not $gitUser) {
    $gitUser = Read-Host "Tu nombre de usuario git (ej: Juan Perez)"
    git config user.name $gitUser
}
if (-not $gitEmail) {
    $gitEmail = Read-Host "Tu email de git (ej: juan@correo.com)"
    git config user.email $gitEmail
}
Write-Host "OK: Usuario git -> $gitUser <$gitEmail>" -ForegroundColor Green

# 4. Agregar todos los archivos y hacer commit inicial
git add .
$staged = git diff --cached --name-only
if ($staged) {
    git commit -m "feat: initial commit - Mini Jira frontend

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
    Write-Host "OK: Commit inicial creado" -ForegroundColor Green
} else {
    Write-Host "No hay cambios para commitear (ya tiene commits previos)" -ForegroundColor Yellow
}

# 5. Solicitar URL del repo de GitHub
Write-Host "`n---------------------------------" -ForegroundColor Cyan
Write-Host "Ve a https://github.com/new y crea un repo VACIO (sin README)." -ForegroundColor White
Write-Host "Luego pega la URL aqui (ej: https://github.com/usuario/mini-jira.git)" -ForegroundColor White
$remoteUrl = Read-Host "URL del repo GitHub"

if (-not $remoteUrl) { Write-Error "No se proporcionó URL. Abortando."; exit 1 }

# 6. Conectar remote y push
$existingRemote = git remote 2>$null
if ($existingRemote -contains "origin") {
    git remote set-url origin $remoteUrl
} else {
    git remote add origin $remoteUrl
}

git branch -M main
git push -u origin main

Write-Host "`n=== Proyecto subido exitosamente a GitHub ===" -ForegroundColor Green
Write-Host "URL: $remoteUrl" -ForegroundColor Cyan
Write-Host "RECORDATORIO: El archivo .env NO fue subido (protegido en .gitignore)" -ForegroundColor Yellow
