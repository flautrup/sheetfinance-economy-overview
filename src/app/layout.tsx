import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "SheetFinance | Overview",
  description: "Economy Overview Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface font-body text-on-surface antialiased">
        <Providers>
          <LanguageProvider>
          <div className="min-h-screen flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Topbar />
              <main className="flex-1 ml-0 md:ml-64 p-6 md:p-12">
                {children}
              </main>
            </div>
          </div>
        </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
