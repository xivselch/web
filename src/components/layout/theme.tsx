import { useStore } from "@nanostores/solid";
import { IoMoonSharp, IoSunnySharp, IoLaptopSharp } from "solid-icons/io";
import { VsColorMode } from "solid-icons/vs";
import { createSignal, onMount } from "solid-js";
import { $settings } from "~/lib/store";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

type Theme = "auto" | "dark" | "light";

export default function ThemeToggle() {
  const settings = useStore($settings);
  const [theme, setTheme] = createSignal<Theme>(settings().theme ?? "auto");
  const [systemDark, setSystemDark] = createSignal(false);

  const applyTheme = (theme: Theme) => {
    const isDark = theme === "dark" || (theme === "auto" && systemDark());
    document.documentElement.classList.toggle("dark", isDark);
    $settings.set({ theme: theme });
    setTheme(theme);
  };

  const updateSystemPreference = () =>
    setSystemDark(window.matchMedia("(prefers-color-scheme: dark)").matches);

  onMount(() => {
    updateSystemPreference();
    setTheme(settings().theme ?? "auto");

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", () => {
      updateSystemPreference();
      if (theme() === "auto") applyTheme("auto");
    });
  });

  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger class="hidden sm:block">
        <Button size={"icon"} variant={"ghost"}>
          <IoMoonSharp class="hidden dark:flex" />
          <IoSunnySharp class="flex dark:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={theme()} onChange={applyTheme}>
          <DropdownMenuRadioItem value="light" class="gap-3">
            <IoSunnySharp /> Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" class="gap-3">
            <IoMoonSharp /> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="auto" class="gap-3">
            <IoLaptopSharp /> System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
