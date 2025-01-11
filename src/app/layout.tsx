import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import SessionProvider from "./_components/SessionProvider";
import { TopNav } from "./_components/NavBar";
import { TRPCReactProvider } from "~/trpc/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { DescriptionListProvider } from "./_components/contexts/FullDescSpells";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <SessionProvider>
        <TRPCReactProvider>
          <NuqsAdapter>
            <DescriptionListProvider>
              <body className="flex flex-col overflow-hidden">
                <div className="grid h-screen grid-rows-[auto,1fr]">
                  <TopNav />
                  <main className="overflow-auto">{children}</main>
                </div>
              </body>
            </DescriptionListProvider>
          </NuqsAdapter>
        </TRPCReactProvider>
      </SessionProvider>
    </html>
  );
}
