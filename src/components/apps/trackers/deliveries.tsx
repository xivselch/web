import {
  createMemo,
  createResource,
  createSignal,
  type JSX,
  type Accessor,
  type Setter,
} from "solid-js";
import type { ColumnDef } from "@tanstack/solid-table";
import { DataTable } from "./table";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { TbSelector } from "solid-icons/tb";

type Client = {
  name: string;
  href: string;
  icon: string;
  level: number;
  patch: { name: string; version: string };
  state: {
    weeks: Accessor<number>; // 4 wks from rank 1
    satisfaction: Accessor<string>;
    setSatisfaction: Setter<string>;
  };
};

const columns: ColumnDef<Client>[] = [
  {
    id: "select",
    header: (props) => (
      <Checkbox
        checked={props.table.getIsAllPageRowsSelected()}
        indeterminate={props.table.getIsSomePageRowsSelected()}
        onChange={(value) => {
          props.table.toggleAllPageRowsSelected(!!value);
          props.table.getRowModel().rows.forEach((row) => {
            row.original.state.setSatisfaction(!!value ? "Rank 5" : "Rank 1");
          });
        }}
        aria-label="Select all"
      />
    ),
    cell: (props) => (
      <Checkbox
        checked={props.row.getIsSelected()}
        onChange={(value) => {
          props.row.toggleSelected(!!value);
          props.row.original.state.setSatisfaction(!!value ? "Rank 5" : "Rank 1");
        }}
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
    cell: (props) => (
      <Button
        as="a"
        class="whitespace-break-spaces p-0"
        variant="link"
        href={props.row.original.href}
      >
        <Avatar aria-label={props.row.original.name}>
          <AvatarImage
            src={props.row.original.icon}
            class="aspect-auto size-auto flex self-center mx-auto"
          />
          <AvatarFallback>{props.row.original.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        {props.row.original.name}
      </Button>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "level",
    header: (props) => {
      return (
        <Button
          variant="ghost"
          class="px-2 h-auto"
          onClick={() => props.column.toggleSorting(props.column.getIsSorted() === "asc")}
        >
          Level
          <TbSelector />
        </Button>
      );
    },
    cell: (props) => <Badge>{props.cell.getValue() as string}</Badge>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.patch.version,
    accessorKey: "patch",
    header: (props) => {
      return (
        <Button
          variant="ghost"
          class="px-2 h-auto"
          onClick={() => props.column.toggleSorting(props.column.getIsSorted() === "asc")}
        >
          Patch
          <TbSelector />
        </Button>
      );
    },
    cell: (props) => <Badge>{props.cell.getValue() as string}</Badge>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "satisfaction",
    header: "Satisfaction level",
    cell: (props) => (
      <Select
        value={props.row.original.state.satisfaction()}
        onChange={(value) => {
          props.row.toggleSelected(value === "Rank 5");
          props.row.original.state.setSatisfaction(value!);
        }}
        options={["Rank 1", "Rank 2", "Rank 3", "Rank 4", "Rank 5"]}
        placeholder="Select a rank"
        itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
      >
        <SelectTrigger aria-label="Levels" class="w-[180px]">
          <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
    ),
  },
  {
    accessorKey: "left",
    header: "Until complete",
    cell: (props) => {
      const { original } = props.row;
      return (
        <Badge>
          {original.state.weeks() === 0
            ? "-"
            : `${original.state.weeks()} week${original.state.weeks() > 1 ? "s" : ""}`}
        </Badge>
      );
    },
  },
];

export default function Table(props: { children: JSX.Element }) {
  const [data] = createResource(async () => {
    const res = await fetch("/api/game/deliveries");
    if (!res.ok) return;

    const data: Partial<Client>[] = await res.json();
    const saved = JSON.parse(localStorage.getItem("deliveryProgress") || "[]");

    return data.map((v) => {
      const savedState = saved.find((s: any) => s.name == v.name);
      const [satisfaction, setSatisfaction] = createSignal(savedState?.satisfaction ?? "Rank 1");

      const weeks = createMemo(() => {
        const match = satisfaction().match(/Rank (\d+)/);
        const rank = match ? parseInt(match[1], 10) : 1;
        return Math.max(5 - rank, 0);
      });

      return {
        ...v,
        state: {
          weeks,
          satisfaction,
          setSatisfaction,
        },
      } as Client;
    });
  });

  return (
    <>
      {props.children}
      <DataTable
        columns={columns}
        data={data() ?? []}
        filterBy="name"
        resetFn={(data) => {
          data.forEach((row) => row.state.setSatisfaction("Rank 1"));
          localStorage.removeItem("deliveryProgress");
        }}
        saveFn={(data) => {
          localStorage.setItem(
            "deliveryProgress",
            JSON.stringify(
              data.map((row) => ({
                name: row.name,
                satisfaction: row.state.satisfaction(),
              }))
            )
          );
        }}
        totalCompletedFn={(data) => {
          if (!data.length) return 0;

          let completedRows = 0;
          data.forEach((row) => {
            if (row.state.satisfaction() == "Rank 5") completedRows++;
          });

          return completedRows;
        }}
      />
    </>
  );
}
