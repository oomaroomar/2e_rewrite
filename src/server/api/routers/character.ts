import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";
import { characters } from "~/server/db/schema/characters";

export const characterRouter = createTRPCRouter({
  createCharacter: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(characters).values({
        name: input.name,
        userId: ctx.session.user.id,
      });
    }),
  getMyCharacters: protectedProcedure.query(async ({ ctx }) => {
    const characters = await ctx.db.query.characters.findMany({
      where: (characters, { eq }) => eq(characters.userId, ctx.session.user.id),
      with: { learnedSpells: true, books: true },
      orderBy: (characters, { desc }) => [desc(characters.createdAt)],
    });
    return characters ?? [];
  }),
});
