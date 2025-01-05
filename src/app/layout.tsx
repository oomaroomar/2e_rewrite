import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import SessionProvider from "./_components/SessionProvider";
import { TopNav } from "./_components/NavBar";
import { TRPCReactProvider } from "~/trpc/react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <TRPCReactProvider>
        <html lang="en" className={`${GeistSans.variable}`}>
          <body className="flex flex-col overflow-hidden">
            <div className="grid h-screen grid-rows-[auto,1fr]">
              <TopNav />
              <main className="overflow-auto">{children}</main>
            </div>
          </body>
        </html>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
