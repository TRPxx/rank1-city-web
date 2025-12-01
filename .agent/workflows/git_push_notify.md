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
   - Construct a JSON payload with the commit message and author.
   - Use `curl` or a script to POST the payload to the Discord Webhook URL: `https://discord.com/api/webhooks/1445144998495518821/uHIfO9ZeYt87If-UveTqVaeNP3TikHBwgw5TsAuJrC3tlhkWu6LWNcOTL0aepa3vyUP5`
   - Payload format:
     ```json
     {
       "username": "Rank1 City Deploy Bot",
       "avatar_url": "https://rank1city.com/favicon.svg",
       "embeds": [
         {
           "title": "🚀 New Update Deployed!",
           "description": "**Commit Message:**\n{COMMIT_MESSAGE}",
           "color": 5763719,
           "fields": [
             {
               "name": "Author",
               "value": "Antigravity AI",
               "inline": true
             },
             {
               "name": "Timestamp",
               "value": "{CURRENT_TIMESTAMP}",
               "inline": true
             }
           ],
           "footer": {
             "text": "Rank1 City Web System"
           }
         }
       ]
     }
     ```
