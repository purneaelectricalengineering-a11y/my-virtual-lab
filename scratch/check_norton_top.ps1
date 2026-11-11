Add-Type -AssemblyName System.Drawing

$path = "C:\Users\vijay\.gemini\antigravity\brain\04af1dc8-a2b5-4aba-8d28-f876790cfa37\.user_uploaded\media_1794369401164_4cb7dd2a.jpg"
$bmp = New-Object System.Drawing.Bitmap($path)

function Check-Top-Rails() {
    Write-Host "=== Norton Top Rail (Y=350..400) ==="
    for ($x = 550; $x -lt 950; $x += 5) {
        for ($y = 350; $y -lt 400; $y += 5) {
            $c = $bmp.GetPixel($x, $y)
            if ($c.R -gt 210 -and $c.G -lt 60 -and $c.B -lt 60) {
                Write-Host "  RED at X=$x, Y=$y"
            }
            elseif ($c.B -gt 190 -and $c.R -lt 70 -and $c.G -lt 120) {
                Write-Host "  BLUE at X=$x, Y=$y"
            }
        }
    }
}

Check-Top-Rails
$bmp.Dispose()
