Add-Type -AssemblyName System.Drawing

$path = "C:\Users\vijay\.gemini\antigravity\brain\04af1dc8-a2b5-4aba-8d28-f876790cfa37\.user_uploaded\media_1794369415015_2dd2f46b.jpg"
$bmp = New-Object System.Drawing.Bitmap($path)

Write-Host "Image size:" $bmp.Width "x" $bmp.Height

# Let's inspect horizontal line at y=300 from x=330 to 900
# And horizontal line at y=465 from x=330 to 900
function Check-Line($y, $name) {
    Write-Host "=== Line at Y=$y ($name) ==="
    for ($x = 250; $x -lt 900; $x += 10) {
        $c = $bmp.GetPixel($x, $y)
        # Check if near Red, Blue, or Black socket
        $type = "  "
        if ($c.R -gt 200 -and $c.G -lt 70 -and $c.B -lt 70) { $type = "RED " }
        elseif ($c.B -gt 170 -and $c.R -lt 70 -and $c.G -lt 120) { $type = "BLUE" }
        elseif ($c.R -lt 30 -and $c.G -lt 30 -and $c.B -lt 30) { $type = "BLK " }
        if ($type -ne "  ") {
            Write-Host ("  X={0,4}: {1} (R={2}, G={3}, B={4})" -f $x, $type, $c.R, $c.G, $c.B)
        }
    }
}

Check-Line 300 "Upper Network Rail"
Check-Line 470 "Lower Network Rail"

$bmp.Dispose()
