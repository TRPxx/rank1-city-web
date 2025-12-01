import { Inter, Kanit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import ClientToaster from "@/components/ClientToaster";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-kanit',
});

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
      <body className={`${inter.className} ${kanit.variable} font-sans bg-background`}>
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
