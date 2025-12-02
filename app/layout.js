import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import ClientToaster from "@/components/ClientToaster";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Rank1 City - Roleplay Server",
  description: "The best FiveM Roleplay experience in Thailand",
  openGraph: {
    title: "Rank1 City - Roleplay Server",
    description: "The best FiveM Roleplay experience in Thailand",
    url: "https://rank1city.com",
    siteName: "Rank1 City",
    locale: "th_TH",
    type: "website",
  },
  keywords: ["FiveM", "Roleplay", "GTA V", "Rank1 City", "Thailand"],
  icons: {
    icon: '/favicon.svg',
  },
  metadataBase: new URL('https://rank1city.com'),
  alternates: {
    canonical: 'https://rank1city.com',
  },
};

import fs from 'fs/promises';
import path from 'path';

async function getConfig() {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'config.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return {};
  }
}

import MaintenancePage from '@/components/MaintenancePage';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import MaintenanceListener from '@/components/MaintenanceListener';

export default async function RootLayout({ children }) {
  const siteConfig = await getConfig();
  const session = await getServerSession(authOptions);
  const isMaintenance = siteConfig?.serverStatus === 'maintenance';
  const isAdmin = session?.user?.isAdmin;

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
      </head>
      <body className={`font-sans bg-background`}>
        <SessionProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {isMaintenance && !isAdmin ? (
              <MaintenancePage discordLink={siteConfig?.links?.discord} />
            ) : (
              <>
                <MaintenanceListener />
                <Navbar siteConfig={siteConfig} />
                {children}
              </>
            )}
            <ClientToaster />
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
