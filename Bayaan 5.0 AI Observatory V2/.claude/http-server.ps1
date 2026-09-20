param([int]$Port = 8765, [string]$DocRoot = $PSScriptRoot)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "HTTP Server started on port $Port serving from $DocRoot"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    try {
        $path = $request.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }
        $filePath = Join-Path $DocRoot $path

        if (Test-Path $filePath -PathType Leaf) {
            $fileContent = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $fileContent.Length

            $ext = [System.IO.Path]::GetExtension($filePath)
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css" { $response.ContentType = "text/css; charset=utf-8" }
                ".js" { $response.ContentType = "application/javascript; charset=utf-8" }
                ".json" { $response.ContentType = "application/json; charset=utf-8" }
                ".png" { $response.ContentType = "image/png" }
                ".jpg" { $response.ContentType = "image/jpeg" }
                ".svg" { $response.ContentType = "image/svg+xml; charset=utf-8" }
                ".gif" { $response.ContentType = "image/gif" }
                default { $response.ContentType = "application/octet-stream" }
            }

            $response.OutputStream.Write($fileContent, 0, $fileContent.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
            $response.ContentLength64 = $notFound.Length
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }
    } catch {
        $response.StatusCode = 500
        $error = [System.Text.Encoding]::UTF8.GetBytes("500 Server Error: $_")
        $response.ContentLength64 = $error.Length
        $response.OutputStream.Write($error, 0, $error.Length)
    } finally {
        $response.OutputStream.Close()
    }
}
$listener.Stop()
