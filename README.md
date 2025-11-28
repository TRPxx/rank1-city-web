# 🏙️ Rank1 City - Premium FiveM Roleplay Website

![Rank1 City Banner](/public/images/hero-bg-fivem.webp)

The official web application for **Rank1 City**, Thailand's premier FiveM Roleplay server. This project is a high-performance, visually stunning, and feature-rich platform designed to engage players and manage server activities.

## ✨ Key Features

### 🎨 **Immersive UI/UX**
- **Modern Design:** Built with a "Cyberpunk/Premium" aesthetic using **Tailwind CSS**.
- **Smooth Animations:** Powered by **Framer Motion** for complex entrance effects, scroll reveals, and micro-interactions.
- **Parallax Scrolling:** Engaging landing page experience with scroll-snap sections.

### 🎰 **Interactive Lucky Draw (Gachapon)**
- **Real-time Probability:** Server-side logic for fair item distribution.
- **Premium Animations:** Custom "tape-roll" animation, rotating sunburst effects, and rarity-based glows.
- **Responsive Layout:** Adaptive grid/stack layout for mobile and desktop.
- **History Tracking:** Users can view their past spin results instantly.

### 🚀 **High Performance (Lighthouse 98/100)**
- **Optimized Assets:** All major images converted to **WebP** for lightning-fast loads.
- **Lazy Loading:** Heavy components (News, Feature Tabs) are lazy-loaded to reduce initial bundle size.
- **Code Splitting:** Efficient Next.js App Router implementation.
- **Animation Optimization:** Usage of `will-change` and hardware acceleration for 60fps performance on mobile.

### 🔍 **SEO & Social Ready**
- **Structured Data (JSON-LD):** Marked up as a `VideoGame` for rich search results.
- **Open Graph:** Fully configured metadata for beautiful link previews on Discord and Facebook.
- **Semantic HTML:** Proper heading hierarchy and accessible structure.

### 📱 **PWA & Mobile First**
- **Installable:** Progressive Web App (PWA) support with `manifest.js`. Users can install the site to their home screen.
- **Touch Optimized:** Disable scroll-snap on small screens for better usability.
- **Responsive Navigation:** Mobile-friendly hamburger menu and touch-friendly targets.

### ♿ **Accessibility (WCAG AA)**
- **High Contrast:** Colors tuned for readability in Dark Mode.
- **Keyboard Navigation:** Full focus management and visible focus rings.
- **Screen Reader Friendly:** ARIA labels and semantic tags throughout.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Discord Provider)
- **Database:** MySQL (via `mysql2`)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TRPxx/rank1-city-web.git
   cd rank1-city-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=es_extended
   
   DISCORD_CLIENT_ID=your_discord_id
   DISCORD_CLIENT_SECRET=your_discord_secret
   
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

5. **Open Browser:**
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (Navbar, Footer, LuckyDraw, etc.).
- `lib/`: Utility functions and configuration files (`preregister-config.js`).
- `public/`: Static assets (images, icons).
- `styles/`: Global styles and Tailwind configuration.

---

## 👨‍💻 Developed By
**Rank1 Development Team**

---
*Last Updated: November 2025*
