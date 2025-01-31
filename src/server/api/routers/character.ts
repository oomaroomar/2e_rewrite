import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

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
    const chars = await ctx.db.query.characters.findMany({
      where: eq(characters.userId, ctx.session.user.id),
      with: {
        learnedSpells: {
          with: {
            spell: true,
          },
        },
        books: {
          with: {
            spellCopies: {
              with: {
                spell: true,
              },
            },
          },
        },
      },
    });

    return chars;
  }),
  learnSpell: protectedProcedure
    .input(
      z.object({
        spellId: z.number(),
        characterId: z.number(),
        spellName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(learnedSpells).values({
        userId: ctx.session.user.id,
        spellId: input.spellId,
        charId: input.characterId,
      });
    }),
  deleteCharacter: protectedProcedure
    .input(z.object({ characterId: z.number(), characterName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedCharacter = await ctx.db
        .delete(characters)
        .where(
          and(
            eq(characters.id, input.characterId),
            eq(characters.userId, ctx.session.user.id),
          ),
        )
        .returning();
      if (deletedCharacter.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this character",
        });
      }
    }),
});
