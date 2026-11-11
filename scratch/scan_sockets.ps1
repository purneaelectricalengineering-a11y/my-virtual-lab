Add-Type -AssemblyName System.Drawing

function Scan-Sockets($imgPath, $name) {
    $bmp = New-Object System.Drawing.Bitmap($imgPath)
    Write-Host "=========================================="
    Write-Host "Scanning $name ($($bmp.Width) x $($bmp.Height))"
    Write-Host "=========================================="
    
    # We look for circular socket centers
    # Sockets are Red (R>180, G<70, B<70), Blue (B>160, R<70, G<120), or Black (R<50, G<50, B<50 surrounded by colored ring or border)
    
    $candidates = [System.Collections.Generic.List[PSObject]]::new()
    
    for ($y = 20; $y -lt ($bmp.Height - 20); $y += 2) {
        for ($x = 20; $x -lt ($bmp.Width - 20); $x += 2) {
            $c = $bmp.GetPixel($x, $y)
            
            # Check Red socket ring
            if ($c.R -gt 200 -and $c.G -lt 60 -and $c.B -lt 60) {
                $candidates.Add([PSCustomObject]@{ X = $x; Y = $y; Color = "Red" })
            }
            # Check Blue socket ring
            elseif ($c.B -gt 180 -and $c.R -lt 70 -and $c.G -lt 120) {
                $candidates.Add([PSCustomObject]@{ X = $x; Y = $y; Color = "Blue" })
            }
            # Check Black socket ring (black center surrounded by dark ring)
            elseif ($c.R -lt 30 -and $c.G -lt 30 -and $c.B -lt 30) {
                # To distinguish banana socket hole from meter or lines, check if it's a small circle of black with radius ~ 8-12
                # Check ring around it at distance 12
                $isSocket = $false
                $blackRingCount = 0
                for ($deg = 0; $deg -lt 360; $deg += 45) {
                    $rad = $deg * [Math]::PI / 180.0
                    $rx = [int]($x + 10 * [Math]::Cos($rad))
                    $ry = [int]($y + 10 * [Math]::Sin($rad))
                    if ($rx -ge 0 -and $rx -lt $bmp.Width -and $ry -ge 0 -and $ry -lt $bmp.Height) {
                        $rc = $bmp.GetPixel($rx, $ry)
                        if ($rc.R -lt 60 -and $rc.G -lt 60 -and $rc.B -lt 60) {
                            $blackRingCount++
                        }
                    }
                }
                # Check background outside at dist 18
                $bgCount = 0
                for ($deg = 0; $deg -lt 360; $deg += 45) {
                    $rad = $deg * [Math]::PI / 180.0
                    $rx = [int]($x + 18 * [Math]::Cos($rad))
                    $ry = [int]($y + 18 * [Math]::Sin($rad))
                    if ($rx -ge 0 -and $rx -lt $bmp.Width -and $ry -ge 0 -and $ry -lt $bmp.Height) {
                        $rc = $bmp.GetPixel($rx, $ry)
                        if ($rc.R -gt 150 -and $rc.G -gt 150 -and $rc.B -gt 150) {
                            $bgCount++
                        }
                    }
                }
                if ($blackRingCount -ge 6 -and $bgCount -ge 6) {
                    $candidates.Add([PSCustomObject]@{ X = $x; Y = $y; Color = "Black" })
                }
            }
        }
    }
    
    # Cluster candidates
    $clusters = [System.Collections.Generic.List[PSObject]]::new()
    foreach ($pt in $candidates) {
        $found = $false
        for ($i = 0; $i -lt $clusters.Count; $i++) {
            $cl = $clusters[$i]
            if ($cl.Color -eq $pt.Color) {
                $dx = $pt.X - $cl.X
                $dy = $pt.Y - $cl.Y
                if (($dx*$dx + $dy*$dy) -lt 256) { # 16px radius
                    $cl.X = [int](($cl.X * $cl.Count + $pt.X) / ($cl.Count + 1))
                    $cl.Y = [int](($cl.Y * $cl.Count + $pt.Y) / ($cl.Count + 1))
                    $cl.Count++
                    $found = $true
                    break
                }
            }
        }
        if (-not $found) {
            $clusters.Add([PSCustomObject]@{ X = $pt.X; Y = $pt.Y; Color = $pt.Color; Count = 1 })
        }
    }
    
    Write-Host "Total Sockets Detected: $($clusters.Count)"
    $sorted = $clusters | Sort-Object Y, X
    foreach ($s in $sorted) {
        Write-Host ("  [{0,-5}] X={1,4}, Y={2,4} (cluster size: {3})" -f $s.Color, $s.X, $s.Y, $s.Count)
    }
    
    $bmp.Dispose()
}

Scan-Sockets "C:\Users\vijay\.gemini\antigravity\brain\04af1dc8-a2b5-4aba-8d28-f876790cfa37\.user_uploaded\media_1794369401164_4cb7dd2a.jpg" "Thevenin-Norton"
Scan-Sockets "C:\Users\vijay\.gemini\antigravity\brain\04af1dc8-a2b5-4aba-8d28-f876790cfa37\.user_uploaded\media_1794369415015_2dd2f46b.jpg" "ZH-Parameters"
