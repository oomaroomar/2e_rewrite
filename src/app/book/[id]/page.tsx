"use client";

import { api } from "~/trpc/react";
import SpellPageContainer from "~/app/_components/SpellPage/SpellPageContainer";
import { use, type Usable } from "react";

export default function SpellPageBookWrapper({
  params,
}: {
  params: Usable<unknown>;
}) {
  const searchParams = use(params);
  const bookId = parseInt((searchParams as { id: string }).id);
  const [book] = api.book.getBookById.useSuspenseQuery({
    bookId,
  });
  const bookSpells = book?.spellCopies.map((sc) => sc.spell);

  return <SpellPageContainer specificSpells={bookSpells} />;
}
