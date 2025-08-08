import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  return Response.json([
    {
      name: "Zhloe Aliapoh",
      href: "https://ffxiv.consolegameswiki.com/wiki/Custom_Deliveries/Zhloe_Aliapoh",
      icon: "https://cdn.emetselch.xyz/game/icons/npcs/deliveries/zhloe_aliapoh.png",
      level: 55,
      patch: { name: "Heavensward", version: "3.55a" },
    },
    {
      name: "M'naago",
      href: "https://ffxiv.consolegameswiki.com/wiki/Custom_Deliveries/M'naago",
      icon: "https://cdn.emetselch.xyz/game/icons/npcs/deliveries/m'naago.png",
      level: 60,
      patch: { name: "Stormblood", version: "4.1" },
    },
    {
      name: "Kurenai",
      href: "https://ffxiv.consolegameswiki.com/wiki/Custom_Deliveries/Kurenai",
      icon: "https://cdn.emetselch.xyz/game/icons/npcs/deliveries/kurenai.png",
      level: 62,
      patch: { name: "Stormblood", version: "4.3" },
    },
    {
      name: "Adkiragh",
      href: "https://ffxiv.consolegameswiki.com/wiki/Custom_Deliveries/Adkiragh",
      icon: "https://cdn.emetselch.xyz/game/icons/npcs/deliveries/adkiragh.png",
      level: 66,
      patch: { name: "Stormblood", version: "4.5" },
    },
    {
      name: "Kai-Shirr",
      href: "https://ffxiv.consolegameswiki.com/wiki/Custom_Deliveries/Kai-Shirr",
      icon: "https://cdn.emetselch.xyz/game/icons/npcs/deliveries/kai-shirr.png",
      level: 70,
      patch: { name: "Shadowbringers", version: "5.1" },
    },
    {
      name: "Ehll Tou",
      href: "https://ffxiv.consolegameswiki.com/wiki/Custom_Deliveries/Ehll_Tou",
      icon: "https://cdn.emetselch.xyz/game/icons/npcs/deliveries/ehll_tou.png",
      level: 70,
      patch: { name: "Shadowbringers", version: "5.3" },
    },
    {
      name: "Charlemend",
      href: "https://ffxiv.consolegameswiki.com/wiki/Custom_Deliveries/Charlemend",
      icon: "https://cdn.emetselch.xyz/game/icons/npcs/deliveries/charlemend.png",
      level: 70,
      patch: { name: "Shadowbringers", version: "5.5" },
    },
    {
      name: "Ameliance",
      href: "https://ffxiv.consolegameswiki.com/wiki/Custom_Deliveries/Ameliance",
      icon: "https://cdn.emetselch.xyz/game/icons/npcs/deliveries/ameliance.png",
      level: 80,
      patch: { name: "Endwalker", version: "6.15" },
    },
    {
      name: "Anden",
      href: "https://ffxiv.consolegameswiki.com/wiki/Custom_Deliveries/Anden",
      icon: "https://cdn.emetselch.xyz/game/icons/npcs/deliveries/anden.png",
      level: 80,
      patch: { name: "Endwalker", version: "6.3" },
    },
    {
      name: "Margrat",
      href: "https://ffxiv.consolegameswiki.com/wiki/Custom_Deliveries/Margrat",
      icon: "https://cdn.emetselch.xyz/game/icons/npcs/deliveries/margrat.png",
      level: 80,
      patch: { name: "Endwalker", version: "6.5" },
    },
    {
      name: "Nitowikwe",
      href: "https://ffxiv.consolegameswiki.com/wiki/Custom_Deliveries/Nitowikwe",
      icon: "https://cdn.emetselch.xyz/game/icons/npcs/deliveries/nitowikwe.png",
      level: 90,
      patch: { name: "Dawntrail", version: "7.15" },
    },
  ]);
};
