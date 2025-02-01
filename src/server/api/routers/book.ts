import { and, eq } from "drizzle-orm";
import { TRPCError } from "node_modules/@trpc/server/dist/unstable-core-do-not-import/error/TRPCError";

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
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

  getBookById: publicProcedure
    .input(z.object({ bookId: z.number() }))
    .query(async ({ ctx, input }) => {
      const book = await ctx.db.query.books.findFirst({
        where: (book, { eq }) => eq(book.id, input.bookId),
        with: {
          spellCopies: {
            with: {
              spell: true,
            },
          },
        },
      });
      if (!book) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Book not found" });
      }
      return book;
    }),

  copyBook: protectedProcedure
    .input(z.object({ bookId: z.number(), characterId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const bookToCopy = await ctx.db.query.books.findFirst({
        where: (book, { eq }) => eq(book.id, input.bookId),
        with: {
          spellCopies: true,
        },
      });
      if (!bookToCopy) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Book not found" });
      }
      if (bookToCopy.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to copy this book",
        });
      }
      const bookReturn = await ctx.db
        .insert(books)
        .values({
          name: bookToCopy.name,
          userId: ctx.session.user.id,
          characterId: input.characterId,
          maxPages: bookToCopy.maxPages,
        })
        .returning();
      if (!bookReturn[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create new book",
        });
      }
      const newBook = bookReturn[0];
      await ctx.db.insert(spellCopy).values(
        bookToCopy.spellCopies.map((sc) => ({
          spellId: sc.spellId,
          bookId: newBook.id,
          pages: sc.pages,
        })),
      );
      return newBook;
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

  eraseSpell: protectedProcedure
    .input(
      z.object({
        spellId: z.number(),
        bookId: z.number(),
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
          message: "You are not authorized to delete this spell",
        });
      }
      await ctx.db
        .delete(spellCopy)
        .where(eq(spellCopy.spellId, input.spellId));
    }),
  renameBook: protectedProcedure
    .input(z.object({ bookId: z.number(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const updatedBook = await ctx.db
        .update(books)
        .set({ name: input.name })
        .where(
          and(
            eq(books.id, input.bookId),
            eq(books.userId, ctx.session.user.id),
          ),
        )
        .returning();
      if (!updatedBook[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Book not found",
        });
      }
      return updatedBook[0];
    }),
  deleteBook: protectedProcedure
    .input(z.object({ bookId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const deletedBook = await ctx.db
        .delete(books)
        .where(
          and(
            eq(books.id, input.bookId),
            eq(books.userId, ctx.session.user.id),
          ),
        )
        .returning();
      if (deletedBook.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this book",
        });
      }
      return deletedBook[0];
    }),
});
