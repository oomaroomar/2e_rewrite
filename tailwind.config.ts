import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
export default {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  safelist: [
    "bg-abjuration",
    "bg-alteration",
    "bg-conjuration",
    "bg-divination",
    "bg-enchantment",
    "bg-invocation",
    "bg-illusion",
    "bg-necromancy",
    "bg-wizard",
    "bg-cleric",
    "shadow-abjuration",
    "shadow-alteration",
    "shadow-conjuration",
    "shadow-divination",
    "shadow-enchantment",
    "shadow-invocation",
    "shadow-illusion",
    "shadow-necromancy",
    "hover:shadow-abjuration",
    "hover:shadow-alteration",
    "hover:shadow-conjuration",
    "hover:shadow-divination",
    "hover:shadow-enchantment",
    "hover:shadow-invocation",
    "hover:shadow-illusion",
    "hover:shadow-necromancy",
    "shadow-common",
    "shadow-rare",
    "shadow-epic",
    "shadow-legendary",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        abjuration: "#D9D9D9",
        alteration: "#3D85C6",
        conjuration: "#c200c2",
        divination: "#FBBC04",
        enchantment: "#6AA84F",
        invocation: "#CC0000",
        illusion: "#674EA7",
        necromancy: "#666666",
        wizard: "#6A3190",
        cleric: "#f0e637",
        common: "#4fa346",
        rare: "#323be5",
        epic: "#6405a8",
        legendary: "#e58a12",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
