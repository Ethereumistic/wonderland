import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { NavbarDemo } from "./components/NavbarDemo";
import { dir } from 'i18next'
import { languages } from '../i18n/settings'
import { FloatingNavDemo } from "./components/FloatingNav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

function isRTL(lang: string) {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur']; // Add other RTL languages as needed
  return rtlLanguages.includes(lang);
}

export const metadata: Metadata = {
  title: "FTM FTW",
  description: "Fix the money, fix the world",
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default function RootLayout({
  children,
  params: {
    lng
  }
}: {
  children: React.ReactNode
  params: {
    lng: string
  }
}) {
  return (
    <html lang={lng} dir={isRTL(lng) ? 'rtl' : 'ltr'}>
      {/* <html> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="bg-white dark:bg-black">
            <NavbarDemo />
            {/* <FloatingNavDemo /> */}
            {children}
          </div>
        </Providers>
      </body>
      </html>
  );
}