Add-Type -AssemblyName System.Drawing

$path = "C:\Users\vijay\.gemini\antigravity\brain\04af1dc8-a2b5-4aba-8d28-f876790cfa37\.user_uploaded\media_1794369401164_4cb7dd2a.jpg"
$bmp = New-Object System.Drawing.Bitmap($path)

Write-Host "Image size:" $bmp.Width "x" $bmp.Height

# Check Thevenin circuit (x from 100 to 550, y from 350 to 620)
# Check Norton circuit (x from 550 to 980, y from 350 to 620)

function Check-Area($x1, $y1, $x2, $y2, $name) {
    Write-Host "=== Area: $name ==="
    for ($y = $y1; $y -le $y2; $y += 6) {
        for ($x = $x1; $x -le $x2; $x += 6) {
            $c = $bmp.GetPixel($x, $y)
            $isSocket = $false
            $col = ""
            if ($c.R -gt 210 -and $c.G -lt 60 -and $c.B -lt 60) { $isSocket = $true; $col = "RED" }
            elseif ($c.B -gt 190 -and $c.R -lt 70 -and $c.G -lt 120) { $isSocket = $true; $col = "BLUE" }
            if ($isSocket) {
                # Sample neighborhood
                Write-Host ("  {0,4} at X={1,4}, Y={2,4}" -f $col, $x, $y)
            }
        }
    }
}

Check-Area 130 550 540 610 "Thevenin Bottom Rail"
Check-Area 550 550 980 610 "Norton Bottom Rail"

$bmp.Dispose()
