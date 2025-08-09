import { createResource, type JSX } from "solid-js";
import type { ColumnDef } from "@tanstack/solid-table";
import { DataTable } from "./table";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { TbSelector } from "solid-icons/tb";

type Duty = {
  name: string;
  poetics: number;
  uncapped: number;
  capped: number;
  gil: number;
  seals: number;
  bonus: Record<string, string>;
};

const icons: Record<string, string> = {
  poetics: "https://cdn.emetselch.xyz/game/icons/currency/tomestone/poetics.png",
  uncapped: "https://cdn.emetselch.xyz/game/icons/currency/tomestone/heliometry.png",
  capped: "https://cdn.emetselch.xyz/game/icons/currency/tomestone/mathematics.png",
  gil: "https://cdn.emetselch.xyz/game/icons/currency/gil.png",
};

const columns: ColumnDef<Duty>[] = [
  {
    id: "select",
    header: (props) => (
      <Checkbox
        checked={props.table.getIsAllPageRowsSelected()}
        indeterminate={props.table.getIsSomePageRowsSelected()}
        onChange={(value) => props.table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: (props) => (
      <Checkbox
        checked={props.row.getIsSelected()}
        onChange={(value) => props.row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: (props) => {
      return (
        <Button
          variant="ghost"
          class="px-2 h-auto"
          onClick={() => props.column.toggleSorting(props.column.getIsSorted() === "asc")}
        >
          Name
          <TbSelector />
        </Button>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "poetics",
    header: (props) => {
      return (
        <Button
          variant="ghost"
          class="px-2 h-auto"
          onClick={() => props.column.toggleSorting(props.column.getIsSorted() === "asc")}
        >
          Poetics
          <TbSelector />
        </Button>
      );
    },
    cell: (props) =>
      props.cell.getValue() == 0 ? (
        "-"
      ) : (
        <span class="flex items-center gap-1">
          <img src={icons.poetics} class="size-5" />
          {(props.cell.getValue() as number).toLocaleString()}
        </span>
      ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "uncapped",
    header: (props) => {
      return (
        <Button
          variant="ghost"
          class="px-2 h-auto"
          onClick={() => props.column.toggleSorting(props.column.getIsSorted() === "asc")}
        >
          Uncapped
          <TbSelector />
        </Button>
      );
    },
    cell: (props) =>
      props.cell.getValue() == 0 ? (
        "-"
      ) : (
        <span class="flex items-center gap-1">
          <img src={icons.uncapped} class="size-5" />
          {(props.cell.getValue() as number).toLocaleString()}
        </span>
      ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "capped",
    header: (props) => {
      return (
        <Button
          variant="ghost"
          class="px-2 h-auto"
          onClick={() => props.column.toggleSorting(props.column.getIsSorted() === "asc")}
        >
          Capped
          <TbSelector />
        </Button>
      );
    },
    cell: (props) =>
      props.cell.getValue() == 0 ? (
        "-"
      ) : (
        <span class="flex items-center gap-1">
          <img src={icons.capped} class="size-5" />
          {(props.cell.getValue() as number).toLocaleString()}
        </span>
      ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "gil",
    header: (props) => {
      return (
        <Button
          variant="ghost"
          class="px-2 h-auto"
          onClick={() => props.column.toggleSorting(props.column.getIsSorted() === "asc")}
        >
          Gil
          <TbSelector />
        </Button>
      );
    },
    cell: (props) =>
      props.cell.getValue() == 0 ? (
        "-"
      ) : (
        <span class="flex items-center gap-1">
          <img src={icons.gil} class="size-5" />
          {(props.cell.getValue() as number).toLocaleString()}
        </span>
      ),
    enableSorting: true,
    enableHiding: false,
  },
];

export default function Table(props: { children: JSX.Element }) {
  const [data] = createResource(async () => {
    const res = await fetch("/api/game/roulette");
    if (!res.ok) return;
    return res.json();
  });

  return (
    <>
      {props.children}
      <DataTable tally columns={columns} data={data() ?? []} />
    </>
  );
}
