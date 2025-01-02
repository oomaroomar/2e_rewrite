"use client";

import { api } from "~/trpc/react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const [spells] = api.spell.getSpells.useSuspenseQuery();

  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {spells
          ? spells.map((spell, i) => (
              <div key={i} className="w-48 p-4">
                <div>{spell.name}</div>
              </div>
            ))
          : "loading"}
      </div>
    </main>
  );
}
