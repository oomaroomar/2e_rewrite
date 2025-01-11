"use client";
import { createContext, useState } from "react";
import { type Spell } from "~/types";

export type DescriptionListContextType = {
  spells: Spell[];
  appendSpell: (s: Spell) => void;
};

export const DescriptionListContext =
  createContext<DescriptionListContextType | null>(null);

export const DescriptionListProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [spells, setSpells] = useState<Spell[]>([]);

  const appendSpell = (sp: Spell) => {
    setSpells((prev) => [sp, ...prev]);
  };

  return (
    <DescriptionListContext.Provider value={{ spells, appendSpell }}>
      {children}
    </DescriptionListContext.Provider>
  );
};
