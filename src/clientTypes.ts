"use client";
import { type RouterOutputs } from "./trpc/react";
export type Character = RouterOutputs["character"]["getMyCharacters"][number];
