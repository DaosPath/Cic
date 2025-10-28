<#
  Utility script to launch the Aura Ciclo web app.
  - Installs dependencies automatically if needed
  - Supports optional --install flag to force reinstall
  - Allows overriding host/port via parameters
#>
param(
  [switch]$Install,
  [string]$HostName,
  [int]$Port
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location -Path $PSScriptRoot

try {
  $npmCommand = Get-Command npm -ErrorAction Stop
}
catch {
  Write-Error "npm no está disponible en el PATH. Instala Node.js 18+ e intenta de nuevo."
  exit 1
}

if ($Install -or -not (Test-Path "node_modules")) {
  Write-Host "Instalando dependencias..."
  npm install
}

$npmArgs = @("run", "dev")
$extraArgs = @()

if ($HostName) {
  $extraArgs += "--host=$HostName"
}

if ($Port) {
  $extraArgs += "--port=$Port"
}

if ($extraArgs.Count -gt 0) {
  $npmArgs += "--"
  $npmArgs += $extraArgs
}

Write-Host "Iniciando servidor de desarrollo de Vite..."
$npmPath = if ($npmCommand.Source) { $npmCommand.Source } else { $npmCommand.Definition }
& $npmPath @npmArgs
exit $LASTEXITCODE
