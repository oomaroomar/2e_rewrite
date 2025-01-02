"use client";
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import SessionProvider from "./_components/SessionProvider";
import { TopNav } from "./_components/NavBar";
import { TRPCReactProvider } from "~/trpc/react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex flex-col gap-4">
        <TRPCReactProvider>
          <SessionProvider>
            <TopNav />
            {children}
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
