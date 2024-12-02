import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "~/server/db";
import * as schema from "~/server/db/schema";
import { env } from "~/env.js";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID ?? "",
      clientSecret: env.GITHUB_SECRET ?? "",
    }),
    DiscordProvider({
      clientId: env.DISCORD_ID ?? "",
      clientSecret: env.DISCORD_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
  }),
  callbacks: {
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthOptions;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
