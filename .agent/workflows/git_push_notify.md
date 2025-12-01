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
   - Use the following PowerShell script to send a rich notification (Ensure you replace `{COMMIT_MESSAGE}` with the actual message):
     ```powershell
     $commitMessage = "{COMMIT_MESSAGE}"
     $branch = git rev-parse --abbrev-ref HEAD
     $shortHash = git rev-parse --short HEAD
     $fullHash = git rev-parse HEAD
     $commitUrl = "https://github.com/TRPxx/rank1-city-web/commit/$fullHash"
     $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")

     $payload = @{
         username = "Rank1 City Deploy Bot"
         avatar_url = "https://rank1city.com/favicon.svg"
         embeds = @(
             @{
                 title = "🚀 อัปเดตระบบเรียบร้อย! (New Update)"
                 description = "**รายละเอียดการแก้ไข (Commit Message):**`n$commitMessage"
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
                         name = "เวลา (Timestamp)"
                         value = "$timestamp"
                         inline = $true
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
