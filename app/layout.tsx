import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { NavbarDemo } from "./components/NavbarDemo";
import SessionProvider from "./components/register/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/authOptions";




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



export const metadata: Metadata = {
  title: "FTM FTW",
  description: "Fix the money, fix the world",
};


export default async function RootLayout({
  children,

}: {
  children: React.ReactNode

}) {

  const session = await getServerSession(authOptions);

  return (
      <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider >
        <Providers>

          <div  className="bg-white dark:bg-black">
            <NavbarDemo />
            {/* <FloatingNavDemo /> */}
            {children}
          </div>
        </Providers>
        </SessionProvider>
      </body>
      </html>
  );
}