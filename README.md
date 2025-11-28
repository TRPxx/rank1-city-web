# Rank1 City Website

Official website for Rank1 City FiveM server.

## Features
- **Next.js 14** (App Router)
- **Tailwind CSS** for styling
- **NextAuth.js** for Discord authentication
- **MySQL** database integration
- **Framer Motion** for animations

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=es_extended
   DISCORD_CLIENT_ID=...
   DISCORD_CLIENT_SECRET=...
   NEXTAUTH_SECRET=...
   NEXTAUTH_URL=http://localhost:3000
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
