import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { AppShell } from "@/components/layout/AppShell";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { siteDescription, siteTitle } from "@/copy/layout_Copy";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("sabr-theme");if(t==="dark")document.documentElement.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        <Script id="sabr-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <ThemeProvider>
          <CartProvider>
            <AppShell>{children}</AppShell>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
