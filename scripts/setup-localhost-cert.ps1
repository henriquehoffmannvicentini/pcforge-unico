$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$certDir = Join-Path $repoRoot "certs"
$crtPath = Join-Path $certDir "localhost.crt"
$keyPath = Join-Path $certDir "localhost.key"

New-Item -ItemType Directory -Force -Path $certDir | Out-Null

$cert = New-SelfSignedCertificate `
  -Subject "CN=localhost" `
  -DnsName "localhost" `
  -CertStoreLocation "Cert:\CurrentUser\My" `
  -KeyAlgorithm RSA `
  -KeyLength 2048 `
  -HashAlgorithm SHA256 `
  -NotAfter (Get-Date).AddYears(1) `
  -KeyExportPolicy Exportable

function ConvertTo-Pem {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Label,
    [Parameter(Mandatory = $true)]
    [byte[]] $Bytes
  )

  $base64 = [Convert]::ToBase64String($Bytes)
  $lines = for ($i = 0; $i -lt $base64.Length; $i += 64) {
    $base64.Substring($i, [Math]::Min(64, $base64.Length - $i))
  }

  @(
    "-----BEGIN $Label-----"
    $lines
    "-----END $Label-----"
  ) -join [Environment]::NewLine
}

$certPem = ConvertTo-Pem -Label "CERTIFICATE" -Bytes $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
$rsa = [System.Security.Cryptography.X509Certificates.RSACertificateExtensions]::GetRSAPrivateKey($cert)
if ($rsa.GetType().GetMethod("ExportPkcs8PrivateKey")) {
  $privateKeyBytes = $rsa.ExportPkcs8PrivateKey()
} elseif ($rsa -is [System.Security.Cryptography.RSACng]) {
  $privateKeyBytes = $rsa.Key.Export([System.Security.Cryptography.CngKeyBlobFormat]::Pkcs8PrivateBlob)
} else {
  throw "Could not export private key with this PowerShell/.NET version."
}

$keyPem = ConvertTo-Pem -Label "PRIVATE KEY" -Bytes $privateKeyBytes

Set-Content -Path $crtPath -Value $certPem -Encoding ascii
Set-Content -Path $keyPath -Value $keyPem -Encoding ascii

$trusted = Get-ChildItem Cert:\CurrentUser\Root | Where-Object { $_.Thumbprint -eq $cert.Thumbprint }
if (-not $trusted) {
  Import-Certificate -FilePath $crtPath -CertStoreLocation Cert:\CurrentUser\Root | Out-Null
}

[PSCustomObject]@{
  Subject = $cert.Subject
  Thumbprint = $cert.Thumbprint
  NotAfter = $cert.NotAfter
  Certificate = $crtPath
  Key = $keyPath
}
