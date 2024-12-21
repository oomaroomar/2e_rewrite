"use client";
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import SessionProvider from "./components/SessionProvider";
import { TopNav } from "./components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex flex-col gap-4">
        <SessionProvider>
          <TopNav />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
