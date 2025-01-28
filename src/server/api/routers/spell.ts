import { batchSpellsSchema } from "~/types";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { spells } from "~/server/db/schema/spells";
import { spellSchema } from "~/types";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { users } from "~/server/db/schema/users";
import { TRPCError } from "@trpc/server";

const inputSpellSchema = spellSchema.omit({ source: true });

export const spellRouter = createTRPCRouter({
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
  // The application is only used by me and my friends, so I don't need to check for permissions
  editSpell: protectedProcedure
    .input(z.object({ spellId: z.number(), spell: inputSpellSchema }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });
      console.log(user);
      if (user?.isAdmin) {
        await ctx.db
          .update(spells)
          .set(input.spell)
          .where(eq(spells.id, input.spellId));
        return;
      } else {
        const updatedSpell = await ctx.db
          .update(spells)
          .set(input.spell)
          .where(
            and(
              eq(spells.id, input.spellId),
              eq(spells.creatorId, ctx.session.user.id),
            ),
          )
          .returning();
        if (updatedSpell.length === 0) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to edit this spell",
          });
        }
        return;
      }
    }),
});
