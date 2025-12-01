---
description: Push to Git and Notify Discord
---

This workflow pushes changes to the git repository and then sends a notification to a Discord webhook with the commit details.

1. Check git status
   - Run `git status` to see pending changes.

2. Add all changes
   - Run `git add .`

3. Commit changes
   - Ask the user for a commit message or use a default one if provided in the context.
   - Run `git commit -m "YOUR_COMMIT_MESSAGE"`

4. Push changes
   - Run `git push`

5. Notify Discord
   - Use the following PowerShell script to send a rich notification with detailed line changes:
     ```powershell
     $commitMessage = "{COMMIT_MESSAGE}"
     $branch = git rev-parse --abbrev-ref HEAD
     $shortHash = git rev-parse --short HEAD
     $fullHash = git rev-parse HEAD
     $commitUrl = "https://github.com/TRPxx/rank1-city-web/commit/$fullHash"
     $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
     $stats = git diff --shortstat HEAD^ HEAD
     
     # Parse line numbers from git diff
     $diffOutput = git diff --unified=0 HEAD^ HEAD
     $fileDetails = @()
     $currentFile = ""
     $lines = @()
     
     foreach ($line in $diffOutput) {
         if ($line -match "^\+\+\+ b/(.*)") {
             if ($currentFile -ne "") {
                 $lineStr = $lines -join ", "
                 if ($lineStr) { $fileDetails += "**$currentFile**: $lineStr" }
                 else { $fileDetails += "**$currentFile**" }
             }
             $currentFile = $matches[1]
             $lines = @()
         }
         elseif ($line -match "^@@ .* \+(\d+)(?:,(\d+))? @@") {
             $start = [int]$matches[1]
             $count = if ($matches[2]) { [int]$matches[2] } else { 1 }
             if ($count -gt 0) {
                 $end = $start + $count - 1
                 if ($start -eq $end) { $lines += "L$start" } else { $lines += "L$start-$end" }
             }
         }
     }
     if ($currentFile -ne "") { 
         $lineStr = $lines -join ", "
         if ($lineStr) { $fileDetails += "**$currentFile**: $lineStr" }
         else { $fileDetails += "**$currentFile**" }
     }
     
     $detailedChanges = $fileDetails -join "`n"
     if ($detailedChanges.Length -gt 1000) { $detailedChanges = $detailedChanges.Substring(0, 990) + "... (truncated)" }
     if (-not $detailedChanges) { $detailedChanges = "No content changes (maybe binary files or renames)." }
     if (-not $stats) { $stats = "Initial commit or no changes" }

     $payload = @{
         username = "Rank1 City Deploy Bot"
         avatar_url = "https://rank1city.com/favicon.svg"
         embeds = @(
             @{
                 title = "🚀 อัปเดตระบบเรียบร้อย! (New Update)"
                 description = "```ansi`n$commitMessage`n```"
                 color = 5763719
                 fields = @(
                     @{
                         name = "ผู้แก้ไข (Author)"
                         value = "Bear"
                         inline = $true
                     },
                     @{
                         name = "สาขา (Branch)"
                         value = "`$branch"
                         inline = $true
                     },
                     @{
                         name = "รหัส (Hash)"
                         value = "[$shortHash]($commitUrl)"
                         inline = $true
                     },
                     @{
                         name = "สถิติ (Stats)"
                         value = "$stats"
                         inline = $true
                     },
                     @{
                         name = "เวลา (Timestamp)"
                         value = "$timestamp"
                         inline = $true
                     },
                     @{
                         name = "📂 ไฟล์ที่แก้ไข (Files Changed)"
                         value = "```yaml`n$detailedChanges`n```"
                         inline = $false
                     }
                 )
                 footer = @{
                     text = "Rank1 City Web System • $shortHash"
                 }
             }
         )
     }
     
     $jsonPayload = $payload | ConvertTo-Json -Depth 10
     $utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonPayload)
     
     Invoke-RestMethod -Uri "https://discord.com/api/webhooks/1445144998495518821/uHIfO9ZeYt87If-UveTqVaeNP3TikHBwgw5TsAuJrC3tlhkWu6LWNcOTL0aepa3vyUP5" -Method Post -ContentType "application/json; charset=utf-8" -Body $utf8Bytes
     ```
