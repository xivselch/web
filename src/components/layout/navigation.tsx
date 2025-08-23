import { FaSolidCoins, FaSolidLeaf, FaSolidPerson } from "solid-icons/fa";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuIcon,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuLabel,
  NavigationMenuDescription,
} from "~/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { IoClose, IoSearch } from "solid-icons/io";
import { CgMenuLeft } from "solid-icons/cg";
import { createSignal } from "solid-js";
import Logo from "~/assets/Logo.svg";

export function MegaMenu() {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuTrigger as="a" href="/characters">
          Characters
        </NavigationMenuTrigger>
      </NavigationMenu>
      <NavigationMenu class="hidden md:flex" placement="bottom-start">
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            Compendium
            <NavigationMenuIcon />
          </NavigationMenuTrigger>
          <NavigationMenuContent class="w-64">
            <h5 class="ml-3 pb-2 uppercase text-xs opacity-50">Trackers</h5>
            <NavigationMenuLink href="/tools/deliveries" class="flex items-center gap-2 py-1">
              <FaSolidPerson class="flex size-8 p-1.5 rounded-md bg-muted/25 border" />
              <div>
                <NavigationMenuLabel>Custom Deliveries</NavigationMenuLabel>
                <NavigationMenuDescription>Weekly NPC deliveries</NavigationMenuDescription>
              </div>
            </NavigationMenuLink>
            <NavigationMenuLink href="/tools/societies" class="flex items-center gap-2 py-1">
              <FaSolidLeaf class="flex size-8 p-1.5 rounded-md bg-muted/25 border" />
              <div>
                <NavigationMenuLabel>Society quests</NavigationMenuLabel>
                <NavigationMenuDescription>Daily NPC quests</NavigationMenuDescription>
              </div>
            </NavigationMenuLink>
            <NavigationMenuLink href="/tools/roulette" class="flex items-center gap-2 py-1">
              <FaSolidCoins class="flex size-8 p-1.5 rounded-md bg-muted/25 border" />
              <div>
                <NavigationMenuLabel>Duty roulette</NavigationMenuLabel>
                <NavigationMenuDescription>Daily duty rewards</NavigationMenuDescription>
              </div>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
    </>
  );
}

export function MobileMenu() {
  const [open, setOpen] = createSignal(false);

  return (
    <Sheet open={open()} onOpenChange={setOpen}>
      <SheetTrigger class="px-2">
        <CgMenuLeft class="size-6" />
        <span class="sr-only">Open navigation menu</span>
      </SheetTrigger>
      <SheetContent position={"left"}>
        <SheetHeader class="mb-6">
          <div class="flex flex-row justify-between items-center space-x-2 rtl:space-x-reverse">
            <div class="flex items-center space-x-2 rtl:space-x-reverse">
              <img src={Logo.src} class="h-12 w-12" />
              <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Emet-Selch<span class="text-red-600">.</span>
              </span>
            </div>
            <Tooltip>
              <TooltipTrigger class="items-center">
                <Button size={"icon"} variant={"ghost"} onClick={() => setOpen(false)}>
                  <IoClose />
                  <span class="sr-only">Close</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Close</TooltipContent>
            </Tooltip>
          </div>
        </SheetHeader>

        <div class="flex flex-col gap-6">
          <div>
            <a
              href="/characters"
              class="flex items-center gap-2 p-2 rounded-md hover:bg-muted/10 dark:hover:bg-muted/20 transition"
            >
              <IoSearch class="size-8 p-1.5 rounded-md bg-muted/25 border" />
              <div class="flex flex-col">
                <span class="font-semibold">Character Search</span>
                <span class="text-xs opacity-70">Search for Lodestone character</span>
              </div>
            </a>
          </div>

          <div>
            <h5 class="ml-1 mb-2 uppercase text-xs opacity-50">Trackers</h5>
            <a
              href="/tools/deliveries"
              class="flex items-center gap-2 p-2 rounded-md hover:bg-muted/10 dark:hover:bg-muted/20 transition"
            >
              <FaSolidPerson class="size-8 p-1.5 rounded-md bg-muted/25 border" />
              <div class="flex flex-col">
                <span class="font-semibold">Custom Deliveries</span>
                <span class="text-xs opacity-70">Weekly NPC deliveries</span>
              </div>
            </a>
            <a
              href="/tools/societies"
              class="flex items-center gap-2 p-2 rounded-md hover:bg-muted/10 dark:hover:bg-muted/20 transition"
            >
              <FaSolidLeaf class="size-8 p-1.5 rounded-md bg-muted/25 border" />
              <div class="flex flex-col">
                <span class="font-semibold">Society Quests</span>
                <span class="text-xs opacity-70">Daily NPC quests</span>
              </div>
            </a>
            <a
              href="/tools/roulette"
              class="flex items-center gap-2 p-2 rounded-md hover:bg-muted/10 dark:hover:bg-muted/20 transition"
            >
              <FaSolidCoins class="size-8 p-1.5 rounded-md bg-muted/25 border" />
              <div class="flex flex-col">
                <span class="font-semibold">Duty Roulette</span>
                <span class="text-xs opacity-70">Daily duty rewards</span>
              </div>
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
