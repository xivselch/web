import { useStore } from "@nanostores/solid";
import { createEffect, createMemo, createResource, createSignal, Show } from "solid-js";
import { $selected } from "~/lib/store";
import { signIn, signOut } from "auth-astro/client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  IoClose,
  IoDocumentText,
  IoEye,
  IoLink,
  IoPerson,
  IoRefresh,
  IoSearch,
  IoSwapHorizontal,
} from "solid-icons/io";
import type { Character } from "~/types";
import { Separator } from "~/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FiLogOut, FiSettings } from "solid-icons/fi";
import { FaSolidCoins, FaSolidLeaf, FaSolidPerson } from "solid-icons/fa";
import { BiRegularHelpCircle } from "solid-icons/bi";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function UserMenu() {
  const [open, setOpen] = createSignal(false);

  const [session] = createResource(async () => {
    const res = await fetch("/api/auth/@me");
    if (!res.ok) return null;
    return res.json();
  });

  const [characters] = createResource(async () => {
    const res = await fetch("/api/auth/characters");
    if (!res.ok) return null;
    const data: Character[] = await res.json();
    return data.reduce((acc, char) => {
      acc[char.id] = char;
      return acc;
    }, {} as Record<string, Character>);
  });

  const [selected, setSelected] = createSignal<string>("");

  createEffect(() => {
    if (characters() && !selected()) {
      setSelected($selected.get()! ?? Object.entries(characters()!)[0][0]);
      $selected.set(selected());
    }
  });

  return (
    <Show
      when={selected() || session()}
      fallback={
        <div class="flex items-center px-2 gap-2">
          <Button as="a" href="/characters" variant={"secondary"}>
            Select character
          </Button>
          <Button onClick={() => signIn("discord")}>Login</Button>
        </div>
      }
    >
      <Sheet open={open()} onOpenChange={setOpen}>
        <SheetTrigger>
          <Avatar class="size-10 border">
            <AvatarImage src={(characters()?.[selected()] ?? session())?.avatar} />
            <AvatarFallback>
              {(characters()?.[selected()]?.name ?? session()?.global_name)
                ?.match(/\b(\w)/g)
                ?.join("") ?? <IoPerson />}
            </AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent class="rounded-l-xl">
          <SheetHeader class="text-left">
            <SheetTitle class="flex justify-between">
              <div class="flex items-center gap-2">
                <Show
                  when={characters()}
                  fallback={
                    <>
                      <Avatar class="size-10">
                        <AvatarImage src={session().avatar} />
                        <AvatarFallback>
                          {session()
                            .global_name?.match(/\b(\w)/g)
                            ?.join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div class="grid text-sm">
                        <span>{session()?.global_name}</span>
                        <span class="text-muted-foreground font-medium">Discord Account</span>
                      </div>
                    </>
                  }
                >
                  <Avatar class="size-10">
                    <AvatarImage src={characters()?.[selected()].avatar} />
                    <AvatarFallback>
                      {characters()
                        ?.[selected()].name?.match(/\b(\w)/g)
                        ?.join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div class="grid text-sm">
                    <span>{characters()?.[selected()].name}</span>
                    <span class="text-muted-foreground font-medium">
                      {`${characters()?.[selected()]?.world_name} (${
                        characters()?.[selected()]?.dc_name
                      })`}
                    </span>
                  </div>
                </Show>
              </div>
              <div class="flex items-center text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger>
                    <Button size={"icon"} variant={"ghost"} onClick={() => setOpen(false)}>
                      <IoClose />
                      <span class="sr-only">Close</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Close</TooltipContent>
                </Tooltip>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div class="grid py-4">
            <Show
              when={session()}
              fallback={
                <>
                  <Button onClick={() => signIn("discord")} variant="default" class="justify-start">
                    <div class="flex items-center gap-2">
                      <IoLink class="size-8" />
                      Link Discord account
                    </div>
                  </Button>
                  <span class="text-xs text-muted-foreground px-2">
                    Using guest mode — progress is saved locally.
                  </span>
                </>
              }
            >
              <Button
                as="a"
                href={`/characters/${selected()}`}
                variant="ghost"
                class="justify-start"
              >
                <div class="flex items-center gap-2">
                  <IoPerson class="size-8" />
                  Character profile
                </div>
              </Button>
              <Button variant={"ghost"} class="justify-start">
                <div class="flex items-center gap-2">
                  <IoSwapHorizontal />
                  Switch character
                </div>
              </Button>
              <Button variant={"ghost"} class="justify-start">
                <div class="flex items-center gap-2">
                  <IoRefresh class="size-8" />
                  Refresh character
                </div>
              </Button>
              <Separator class="my-2" />
              <Button variant={"ghost"} class="justify-start">
                <div class="flex items-center gap-2">
                  <FiSettings class="size-8" />
                  Account settings
                </div>
              </Button>
              <Button as="a" href="/support" variant={"ghost"} class="justify-start">
                <div class="flex items-center gap-2">
                  <BiRegularHelpCircle class="size-8" />
                  Help center
                </div>
              </Button>
              <Button variant={"ghost"} class="justify-start" onClick={() => signOut()}>
                <div class="flex items-center gap-2">
                  <FiLogOut class="size-8" />
                  Logout
                </div>
              </Button>
            </Show>
          </div>
        </SheetContent>
      </Sheet>
    </Show>
  );
}
