import { api } from "~/trpc/server";
import SpellPage from "./_components/SpellPage";
import { HydrateClient } from "~/trpc/server";

export default async function HomePage() {
  void api.spell.getSpells.prefetch();

  return (
    <HydrateClient>
      <SpellPage />
    </HydrateClient>
  );
}
