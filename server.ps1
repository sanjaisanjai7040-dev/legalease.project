$port = 4000
$rootPath = "C:\Users\smath\OneDrive\Desktop\legalEase"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host ""
Write-Host "  ======================================" -ForegroundColor Cyan
Write-Host "  LegalEase is running!" -ForegroundColor Green
Write-Host "  URL: http://localhost:$port" -ForegroundColor Yellow
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "  ======================================" -ForegroundColor Cyan
Write-Host ""

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".json" = "application/json"
    ".woff2"= "font/woff2"
    ".woff" = "font/woff"
    ".ttf"  = "font/ttf"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath
        if ($rawUrl -eq "/" -or $rawUrl -eq "") { $rawUrl = "/index.html" }

        $filePath = Join-Path $rootPath ($rawUrl.TrimStart("/").Replace("/", "\"))

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $content.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($content, 0, $content.Length)
            Write-Host "  200  $rawUrl" -ForegroundColor Green
        } else {
            $body = [System.Text.Encoding]::UTF8.GetBytes("404 - Not Found: $rawUrl")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $body.Length
            $response.StatusCode = 404
            $response.OutputStream.Write($body, 0, $body.Length)
            Write-Host "  404  $rawUrl" -ForegroundColor Red
        }

        $response.OutputStream.Close()
    } catch {
        if ($listener.IsListening) {
            Write-Host "  Error: $_" -ForegroundColor Red
        }
    }
}
