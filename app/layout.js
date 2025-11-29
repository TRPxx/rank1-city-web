import { Inter, Kanit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import ClientToaster from "@/components/ClientToaster";

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

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${inter.className} ${kanit.variable} font-sans`}>
        <SessionProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ClientToaster />
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
