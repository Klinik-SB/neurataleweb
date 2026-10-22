param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$projectDirectory = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $projectDirectory '.local'
$address = 'http://127.0.0.1:5188'
$alreadyStarted = $false
try {
    $response = Invoke-WebRequest -Uri $address -TimeoutSec 2 -UseBasicParsing
    $alreadyStarted = $response.Content -match '<title>.*Neuratale</title>'
} catch {}
if (-not $alreadyStarted) {
    if (Get-NetTCPConnection -LocalPort 5188 -State Listen -ErrorAction SilentlyContinue) {
        throw 'Otro programa usa el puerto 5188. Cerralo o ejecuta Neuratale con otra configuración de puerto.'
    }
    New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
    $nodePath = (Get-Command node -ErrorAction Stop).Source
    $serverPath = Join-Path $projectDirectory 'server.mjs'
    $process = Start-Process -FilePath $nodePath -ArgumentList @('"' + $serverPath + '"') -WorkingDirectory $projectDirectory -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimeDirectory 'server.log') -RedirectStandardError (Join-Path $runtimeDirectory 'server.error.log') -PassThru
    $process.Id | Set-Content -LiteralPath (Join-Path $runtimeDirectory 'server.pid')
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri $address -TimeoutSec 1 -UseBasicParsing
            if ($response.StatusCode -eq 200) { break }
        } catch { Start-Sleep -Milliseconds 200 }
    }
}
if (-not $NoBrowser) { Start-Process $address }
