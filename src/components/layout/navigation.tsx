import { For, Show } from "solid-js";
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

type MenuChild = {
  label: string;
  href: string;
  description?: string;
};

type MenuItem = {
  label: string;
  href?: string;
  children?: MenuChild[];
};

interface MegaMenuProps {
  items: MenuItem[];
}

export function MegaMenu(props: MegaMenuProps) {
  return (
    <NavigationMenu>
      <For each={props.items}>
        {(item) => (
          <NavigationMenuItem>
            <Show
              when={item.children && item.children.length > 0}
              fallback={
                <NavigationMenuLink as="a" href={item.href || "#"}>
                  {item.label}
                </NavigationMenuLink>
              }
            >
              <NavigationMenuTrigger>
                {item.label}
                <NavigationMenuIcon />
              </NavigationMenuTrigger>
              <NavigationMenuContent class="w-96">
                <For each={item.children}>
                  {(child) => (
                    <NavigationMenuLink as="a" href={child.href}>
                      <NavigationMenuLabel>{child.label}</NavigationMenuLabel>
                      {child.description && (
                        <NavigationMenuDescription>{child.description}</NavigationMenuDescription>
                      )}
                    </NavigationMenuLink>
                  )}
                </For>
              </NavigationMenuContent>
            </Show>
          </NavigationMenuItem>
        )}
      </For>
    </NavigationMenu>
  );
}
