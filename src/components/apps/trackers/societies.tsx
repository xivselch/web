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
import { TextField, TextFieldInput, TextFieldErrorMessage } from "~/components/ui/text-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { TbSelector } from "solid-icons/tb";

type Rank = {
  name:
    | "None"
    | "Neutral"
    | "Recognized"
    | "Trusted"
    | "Respected"
    | "Honored"
    | "Sworn"
    | "Bloodsworn"
    | "Allied";
  repRequired: number | null;
};

type Society = {
  name: string;
  href: string;
  patch: { name: string; version: string };
  icon: string;
  ranks: Rank[];
  repPerQuest: number[];
  state: {
    days: Accessor<number>;
    rankIndex: Accessor<number>;
    setRankIndex: Setter<number>;
    remaining: Accessor<number>;
    reputation: Accessor<number>;
    setReputation: Setter<number>;
  };
};

const columns: ColumnDef<Society>[] = [
  {
    id: "select",
    header: (props) => (
      <Checkbox
        checked={props.table.getIsAllPageRowsSelected()}
        indeterminate={props.table.getIsSomePageRowsSelected()}
        onChange={(value) => {
          props.table.toggleAllPageRowsSelected(!!value);
          props.table.getRowModel().rows.forEach((row) => {
            row.original.state.setRankIndex(!!value ? row.original.ranks.length - 1 : 0);
            row.original.state.setReputation(0);
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
          props.row.original.state.setRankIndex(!!value ? props.row.original.ranks.length - 1 : 0);
          props.row.original.state.setReputation(0);
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
    accessorKey: "rank",
    header: "Current rank",
    cell: (props) => (
      <Select
        value={props.row.original.ranks[props.row.original.state.rankIndex()].name}
        onChange={(value) => {
          if (value) {
            const ranks = props.row.original.ranks.map((v) => v.name);
            props.row.original.state.setRankIndex(ranks.findIndex((r) => r === value));
            props.row.original.state.setReputation(0);
          }
        }}
        options={props.row.original.ranks.map((v) => v.name)}
        placeholder={props.row.original.ranks[props.row.original.state.rankIndex()].name}
        itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
      >
        <SelectTrigger aria-label="Rank">
          <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
    ),
  },
  {
    accessorKey: "reputation",
    header: "Current reputation",
    cell: (props) => (
      <TextField>
        <TextFieldInput
          type="number"
          value={props.row.original.state.reputation()}
          onInput={(e) => props.row.original.state.setReputation(Number(e.currentTarget.value))}
        />
        <TextFieldErrorMessage />
      </TextField>
    ),
  },
  {
    accessorKey: "remaining",
    header: "Remaining",
    cell: (props) => (
      <Badge>
        {props.row.original.state.remaining() === 0 ? "-" : props.row.original.state.remaining()}
      </Badge>
    ),
  },
  {
    accessorKey: "left",
    header: "Until next rank",
    cell: (props) => (
      <Badge>
        {props.row.original.state.days() === 0
          ? "-"
          : `${props.row.original.state.days()} day${
              props.row.original.state.days() > 1 ? "s" : ""
            }`}
      </Badge>
    ),
  },
];

export default function Table(props: { children: JSX.Element }) {
  const [data] = createResource(async () => {
    const res = await fetch("/api/game/societies");
    if (!res.ok) return;

    const data: Partial<Society>[] = await res.json();
    const saved = JSON.parse(localStorage.getItem("societyProgress") || "[]");

    return data.map((v) => {
      const savedState = saved.find((s: any) => s.name == v.name);
      const [rankIndex, setRankIndex] = createSignal(savedState?.rankIndex ?? 0);
      const [reputation, setReputation] = createSignal(savedState?.reputation ?? 0);

      const remaining = createMemo(() => {
        const next = v.ranks?.[rankIndex() + 1];
        return next?.repRequired != null ? Math.max(0, next.repRequired - reputation()) : 0;
      });

      const days = createMemo(() => {
        let maxPerDay = 0;
        if (Array.isArray(v.repPerQuest) && v.repPerQuest.length > 1) {
          const idx = Math.min(rankIndex(), v.repPerQuest.length - 1);
          maxPerDay = v.repPerQuest[idx] * 3;
        } else if (Array.isArray(v.repPerQuest) && v.repPerQuest.length === 1) {
          maxPerDay = v.repPerQuest[0] * 3;
        }
        return maxPerDay > 0 ? Math.ceil(remaining() / maxPerDay) : 0;
      });

      return {
        ...v,
        state: {
          days,
          rankIndex,
          setRankIndex,
          remaining,
          reputation,
          setReputation,
        },
      } as Society;
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
          data.forEach((row) => {
            row.state.setRankIndex(0);
            row.state.setReputation(0);
          });
          localStorage.removeItem("societyProgress");
        }}
        saveFn={(data) => {
          localStorage.setItem(
            "societyProgress",
            JSON.stringify(
              data.map((row) => ({
                name: row.name,
                rankIndex: row.state.rankIndex(),
                reputation: row.state.reputation(),
              }))
            )
          );
        }}
        totalCompletedFn={(data) => {
          if (!data.length) return 0;

          let completedRows = 0;
          data.forEach((row) => {
            const isLastRank = row.state.rankIndex() === row.ranks.length - 1;
            if (isLastRank) completedRows++;
          });

          return completedRows;
        }}
      />
    </>
  );
}
