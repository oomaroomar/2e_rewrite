import { TRPCError } from "node_modules/@trpc/server/dist/unstable-core-do-not-import/error/TRPCError";

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";
import { books, spellCopy } from "~/server/db/schema/characters";

export const bookRouter = createTRPCRouter({
  createBook: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        maxPages: z.number(),
        characterId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const character = await ctx.db.query.characters.findFirst({
        where: (char, { eq }) => eq(char.id, input.characterId),
      });
      if (!character) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Character not found",
        });
      }
      if (character.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create a book for this character",
        });
      }
      await ctx.db.insert(books).values({
        name: input.name,
        userId: ctx.session.user.id,
        characterId: input.characterId,
        maxPages: input.maxPages,
      });
    }),

  writeSpell: protectedProcedure
    .input(
      z.object({
        spellId: z.number(),
        bookId: z.number(),
        pages: z.number(),
        spellName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const book = await ctx.db.query.books.findFirst({
        where: (book, { eq }) => eq(book.id, input.bookId),
      });
      if (!book) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Book not found" });
      }
      if (book.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to write to this book",
        });
      }
      await ctx.db.insert(spellCopy).values({
        spellId: input.spellId,
        bookId: input.bookId,
        pages: input.pages,
      });
    }),
});
