for ($i = 1; $i -le 12; $i++) {
  Write-Host "Request $i" -ForegroundColor Cyan

  $body = @{
    email = "test$i@example.com"
    password = "Test123"
    role = "ADMIN"
  } | ConvertTo-Json

  try {
      $response = Invoke-RestMethod -Uri "http://localhost:3001/auth/register" `
          -Method Post `
          -ContentType "application/json" `
          -Body $body `
          -ErrorAction Stop
      
      Write-Host "Success: $($response | ConvertTo-Json -Compress)" -ForegroundColor Green

  } catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Error $statusCode`: $($_.ErrorDetails.Message)" -ForegroundColor Red
  }
  Write-Host ""
}