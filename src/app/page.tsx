import { api } from "~/trpc/server";
import SpellPage from "./_components/SpellPage/SpellPageContainer";
import { HydrateClient } from "~/trpc/server";
import { Suspense } from "react";
import Loading from "~/components/ui/loading";

export default async function HomePage() {
  void api.spell.getSpells.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<Loading />}>
        <SpellPage />
      </Suspense>
    </HydrateClient>
  );
}
