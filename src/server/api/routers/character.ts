import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
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
  getCharacterById: publicProcedure
    .input(z.object({ characterId: z.number() }))
    .query(async ({ ctx, input }) => {
      const character = await ctx.db.query.characters.findFirst({
        where: eq(characters.id, input.characterId),
        with: {
          learnedSpells: {
            with: {
              spell: true,
            },
          },
        },
      });
      return character;
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
  renameCharacter: protectedProcedure
    .input(z.object({ characterId: z.number(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const updatedCharacter = await ctx.db
        .update(characters)
        .set({ name: input.name })
        .where(
          and(
            eq(characters.id, input.characterId),
            eq(characters.userId, ctx.session.user.id),
          ),
        )
        .returning();
      if (!updatedCharacter[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Character not found",
        });
      }
      return updatedCharacter[0];
    }),
  unlearnSpell: protectedProcedure
    .input(
      z.object({
        spellId: z.number(),
        characterId: z.number(),
        spellName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(learnedSpells)
        .where(
          and(
            eq(learnedSpells.spellId, input.spellId),
            eq(learnedSpells.charId, input.characterId),
            eq(learnedSpells.userId, ctx.session.user.id),
          ),
        );
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
