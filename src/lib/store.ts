import { persistentAtom, persistentMap } from "@nanostores/persistent";

export const $selected = persistentAtom<string | undefined>("selected");
export const $guest = persistentMap<{
  custom_deliveries: { name: string; completed: boolean }[];
  societies: { name: string; rank: string; reputation: number }[];
}>(
  "guest:",
  { custom_deliveries: [], societies: [] },
  { encode: JSON.stringify, decode: JSON.parse }
);
export const $settings = persistentMap<{
  theme?: "auto" | "dark" | "light";
  cookies?: string; // "essential,analytics"
}>("settings:", {
  theme: "auto",
});
