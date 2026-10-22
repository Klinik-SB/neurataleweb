param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$projectDirectory = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $projectDirectory '.local'
$address = 'http://127.0.0.1:5188'
$nodePath = (Get-Command node -ErrorAction Stop).Source
$buildPath = Join-Path $projectDirectory 'scripts\build.mjs'
if (-not (Test-Path -LiteralPath (Join-Path $projectDirectory 'node_modules\sharp\package.json'))) {
    $npmPath = (Get-Command npm.cmd -ErrorAction Stop).Source
    Push-Location -LiteralPath $projectDirectory
    try {
        & $npmPath ci
        if ($LASTEXITCODE -ne 0) { throw 'No se pudieron instalar las herramientas de compilación. Revisá la conexión y ejecutá npm ci.' }
    } finally { Pop-Location }
}
& $nodePath $buildPath
if ($LASTEXITCODE -ne 0) { throw 'No se pudo generar la web. El servidor no se inicia con una compilación incompleta.' }
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
