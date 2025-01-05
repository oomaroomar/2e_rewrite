import { z } from "zod";
import { batchSpellsSchema } from "~/types";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { spells } from "~/server/db/schema/spells";
import { spellSchema } from "~/types";

const inputSpellSchema = spellSchema.omit({ source: true });

export const spellRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  createSpell: protectedProcedure
    .input(inputSpellSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(spells).values({
        ...input,
        source: "homebrew",
        creatorId: ctx.session.user.id,
      });
    }),
  batchCreateSpells: protectedProcedure
    .input(batchSpellsSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(spells).values(input);
    }),
  getSpells: publicProcedure.query(async ({ ctx }) => {
    const spells = await ctx.db.query.spells.findMany({
      with: { creator: true },
      orderBy: (spells, { asc }) => [asc(spells.level), asc(spells.name)],
    });
    return spells ?? [];
  }),
  // await ctx.db.insert(spells).values(input);
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
