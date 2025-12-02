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
   - Run the Node.js script to send a rich notification:
     ```bash
     node .agent/workflows/notify_discord.js
     ```
