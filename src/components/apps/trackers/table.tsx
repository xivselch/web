import {
  type ColumnFiltersState,
  type ColumnDef,
  createSolidTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type VisibilityState,
  getSortedRowModel,
} from "@tanstack/solid-table";
import { createMemo, createSignal, For, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { Col, Grid } from "~/components/ui/grid";
import { Progress } from "~/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TextField, TextFieldInput } from "~/components/ui/text-field";

interface DataTableProps<T, V> {
  columns: ColumnDef<T, V>[];
  data: T[];
  filterBy?: string;
  tally?: boolean;
  resetFn?: (data: T[]) => void;
  saveFn?: (data: T[]) => void;
  totalCompletedFn?: (data: T[]) => number;
}

export function DataTable<T extends unknown, V = any>(props: DataTableProps<T, V>) {
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>({});
  const [rowSelection, setRowSelection] = createSignal<Record<string, boolean>>({});
  const [nameFilter, setNameFilter] = createSignal("");

  const table = createSolidTable({
    get data() {
      return props.data;
    },
    get columns() {
      return props.columns;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      get sorting() {
        return sorting();
      },
      get columnFilters() {
        return columnFilters();
      },
      get columnVisibility() {
        return columnVisibility();
      },
      get rowSelection() {
        return rowSelection();
      },
    },
  });

  return (
    <div class="w-full max-w-3xl space-y-4 mx-auto py-6 not-prose">
      <Grid cols={1}>
        <Col class="flex flex-row w-full items-start md:items-center justify-between gap-4">
          <div class="flex order-1 space-x-2">
            <Show when={props.resetFn}>
              <Button
                variant="secondary"
                class="cursor-pointer"
                onClick={() => props.resetFn!(props.data)}
              >
                Reset all
              </Button>
            </Show>
            <Show when={props.saveFn}>
              <Button class="cursor-pointer" onClick={() => props.saveFn!(props.data)}>
                Save all
              </Button>
            </Show>
          </div>
          <Show when={props.filterBy}>
            <TextField class="flex w-64 mb-2 md:mb-0">
              <TextFieldInput
                placeholder="Filter by name..."
                value={nameFilter()}
                onInput={(e) => {
                  const value = e.currentTarget.value;
                  setNameFilter(value);
                  table.getColumn(props.filterBy ?? "name")?.setFilterValue(value);
                }}
              />
            </TextField>
          </Show>
        </Col>
        <Show when={props.totalCompletedFn}>
          <Col>
            <Progress
              value={props.totalCompletedFn!(props.data)}
              maxValue={props.data.length}
              getValueLabel={({ value, max }) => `${value} of ${max}`}
              class="w-full space-y-1 px-1 mt-4"
            />
          </Col>
        </Show>
      </Grid>

      <div class="overflow-x-auto rounded-md border">
        <Table class="w-full table-auto">
          <TableHeader class="bg-black/5 dark:bg-white/5 h-10">
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <TableRow>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <TableHead colspan={header.colSpan}>
                        <Show when={!header.isPlaceholder}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </Show>
                      </TableHead>
                    )}
                  </For>
                </TableRow>
              )}
            </For>
          </TableHeader>
          <TableBody>
            <Show
              when={table.getRowModel().rows.length}
              fallback={
                <TableRow class="h-10">
                  <TableCell colSpan={props.columns.length} class="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              }
            >
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    <For each={row.getVisibleCells()}>
                      {(cell) => (
                        <TableCell>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )}
                    </For>
                  </TableRow>
                )}
              </For>
            </Show>
          </TableBody>

          <Show when={props.tally && table.getSelectedRowModel().rows.length > 0}>
            <TableFooter class="bg-black/5 dark:bg-white/5 text-invert text-sm">
              <TableRow>
                <For each={table.getVisibleLeafColumns()}>
                  {(column) => {
                    // @ts-ignore 2339 - does exist
                    const accessorKey = column.columnDef.accessorKey as string;
                    if (!accessorKey) return <TableCell />;

                    const selectedSum = createMemo(() =>
                      table.getSelectedRowModel().rows.reduce((sum, row) => {
                        const value = (row.original as any)[accessorKey];
                        return typeof value === "number" && !isNaN(value) ? sum + value : sum;
                      }, 0)
                    );

                    const totalSum = createMemo(() =>
                      props.data.reduce((sum, row) => {
                        const value = (row as any)[accessorKey];
                        return typeof value === "number" && !isNaN(value) ? sum + value : sum;
                      }, 0)
                    );

                    return (
                      <TableCell class="text-left px-2 py-1">
                        <Show when={selectedSum() > 0}>
                          <div class="flex items-center gap-1 text-muted-foreground">
                            <span class="font-bold">{selectedSum().toLocaleString()}</span>
                            <span>/ {totalSum().toLocaleString()}</span>
                          </div>
                        </Show>
                      </TableCell>
                    );
                  }}
                </For>
              </TableRow>
            </TableFooter>
          </Show>
        </Table>
      </div>

      <Show when={props.data.length > 10}>
        <div class="flex items-center justify-end space-x-4">
          <div class="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div class="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              class="cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              class="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      </Show>
    </div>
  );
}
