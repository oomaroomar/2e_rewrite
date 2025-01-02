import "server-only";
import { db } from "../db";
import { spells } from "../db/schema/spells";
import { getServerSession } from "next-auth";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
// figure out auth

export const InsertSpell = async () => {
  const session = await getServerSession(authOptions);
  // if (!session) {
  //   throw new Error("Not authenticated");
  // }
  console.log(session);
  const spell = db.insert(spells).values({
    level: 1,
    name: "Test Spell",
    schools: ["invocation"],
    castingClass: "wizard",
    verbal: true,
    somatic: true,
    material: true,
    materials: "a twig",
    range: "10 feet",
    aoe: "5 foot radius",
    castingTime: "1 action",
    duration: "instantaneous",
    savingThrow: "1/2",
    damage: "1d6",
    description: "A test spell",
    source: "PHB",
  });
  return spell;
};
