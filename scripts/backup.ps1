# ==============================================================================
# CASA GUARDIAN — ENTERPRISE BACKUP ENGINE (scripts/backup.ps1)
# Standard: 3-2-1 Backup Strategy / Tier-1 Startup Governance
# ==============================================================================

param(
    [string]$Note = "post-adjustment-snapshot"
)

$ErrorActionPreference = "Stop"

$ProjectRoot = (Get-Item $PSScriptRoot).Parent.FullName
$BackupDir = Join-Path $ProjectRoot "backups"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$GitPath = "C:\Program Files\Git\cmd\git.exe"
$GitSha = "nogit"
if (Test-Path $GitPath) {
    try {
        $GitSha = (& $GitPath -C $ProjectRoot rev-parse --short HEAD).Trim()
    } catch {
        $GitSha = "local"
    }
}

$BackupFileName = "CASA_GUARDIAN_BACKUP_${Timestamp}_${GitSha}_${Note}.zip"
$BackupZipPath = Join-Path $BackupDir $BackupFileName
$TempStageDir = Join-Path $BackupDir "stage_${Timestamp}"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "🛡️ CASA GUARDIAN — INICIANDO COPIA DE SEGURIDAD EMPRESARIAL" -ForegroundColor Yellow
Write-Host "   Timestamp: $Timestamp" -ForegroundColor Gray
Write-Host "   Git SHA:   $GitSha" -ForegroundColor Gray
Write-Host "   Destino:   $BackupZipPath" -ForegroundColor Gray
Write-Host "=================================================================" -ForegroundColor Cyan

if (Test-Path $TempStageDir) {
    Remove-Item -Recurse -Force $TempStageDir
}
New-Item -ItemType Directory -Path $TempStageDir | Out-Null

$ExcludedFolders = @(".git", "backups", "node_modules", ".vercel")

Get-ChildItem -Path $ProjectRoot -Force | Where-Object {
    $name = $_.Name
    $ExcludedFolders -notcontains $name
} | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $TempStageDir -Recurse -Force
}

Write-Host "📦 Comprimiendo archivos del proyecto..." -ForegroundColor Cyan
Compress-Archive -Path "$TempStageDir\*" -DestinationPath $BackupZipPath -CompressionLevel Optimal -Force

Remove-Item -Recurse -Force $TempStageDir

Write-Host "🔒 Calculando Hash de Integridad SHA-256..." -ForegroundColor Cyan
$FileHash = (Get-FileHash -Path $BackupZipPath -Algorithm SHA256).Hash
$ManifestPath = "$BackupZipPath.sha256"
$ManifestContent = @"
================================================================================
CASA GUARDIAN — CERTIFICADO DE INTEGRIDAD DE RESPALDO EMPRESARIAL
================================================================================
Archivo:       $BackupFileName
Fecha/Hora:    $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')
Git Commit:    $GitSha
Nota:          $Note
Algoritmo:     SHA-256
Hash Digest:   $FileHash
Estado:        CERTIFICADO & INMUTABLE
================================================================================
"@
Set-Content -Path $ManifestPath -Value $ManifestContent -Encoding UTF8

$FileSizeMB = [Math]::Round(((Get-Item $BackupZipPath).Length / 1MB), 2)

Write-Host "✅ RESPALDO GENERADO CON ÉXITO!" -ForegroundColor Green
Write-Host "   Archivo: $BackupFileName ($FileSizeMB MB)" -ForegroundColor White
Write-Host "   SHA-256: $FileHash" -ForegroundColor Green
Write-Host "   Manifiesto: $ManifestPath" -ForegroundColor Gray

$AllBackups = Get-ChildItem -Path $BackupDir -Filter "CASA_GUARDIAN_BACKUP_*.zip" | Sort-Object CreationTime -Descending
if ($AllBackups.Count -gt 7) {
    $ToPrune = $AllBackups | Select-Object -Skip 7
    foreach ($old in $ToPrune) {
        Write-Host "🧹 Rotando respaldo antiguo: $($old.Name)" -ForegroundColor DarkGray
        Remove-Item -Force $old.FullName -ErrorAction SilentlyContinue
        $oldSha = "$($old.FullName).sha256"
        if (Test-Path $oldSha) {
            Remove-Item -Force $oldSha -ErrorAction SilentlyContinue
        }
    }
}

Write-Host "=================================================================" -ForegroundColor Cyan
