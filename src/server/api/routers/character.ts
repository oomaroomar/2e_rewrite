import { eq } from "drizzle-orm";

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";
import { characters, learnedSpells } from "~/server/db/schema/characters";

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
    const chars = await ctx.db
      .select()
      .from(characters)
      .where(eq(characters.userId, ctx.session.user.id));
    const learned = await ctx.db
      .select()
      .from(learnedSpells)
      .where(eq(learnedSpells.userId, ctx.session.user.id));
    return { chars, learned };
  }),
  learnSpell: protectedProcedure
    .input(
      z.object({
        spellId: z.number(),
        characterId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(learnedSpells).values({
        userId: ctx.session.user.id,
        spellId: input.spellId,
        charId: input.characterId,
      });
    }),
});
