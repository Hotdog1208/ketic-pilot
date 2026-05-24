"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatHours } from "@/lib/format";

export type RoomRow = {
  room_number: string;
  room_type: string | null;
  floor: number | null;
  vacancy_hours: number;
  cost_wasted: number;
  ketic_would_save: number;
};

type SortKey = "cost_wasted" | "vacancy_hours" | "ketic_would_save" | "room_number";
type SortDir = "asc" | "desc";

const SORT_CYCLE: { key: SortKey; dir: SortDir; label: string }[] = [
  { key: "cost_wasted", dir: "desc", label: "Cost wasted ↓" },
  { key: "vacancy_hours", dir: "desc", label: "Vacancy hours ↓" },
  { key: "ketic_would_save", dir: "desc", label: "Savings ↓" },
  { key: "room_number", dir: "asc", label: "Room number ↑" },
];

const PAGE_SIZE = 15;

type Props = {
  rows: RoomRow[];
};

export function RoomTable({ rows }: Props) {
  const [sortIdx, setSortIdx] = useState(0);
  const [page, setPage] = useState(1);

  const sort = SORT_CYCLE[sortIdx];

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (typeof av === "number" && typeof bv === "number") {
        return sort.dir === "desc" ? bv - av : av - bv;
      }
      const as = String(av ?? "");
      const bs = String(bv ?? "");
      return sort.dir === "desc" ? bs.localeCompare(as) : as.localeCompare(bs);
    });
    return copy;
  }, [rows, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function cycleSort() {
    setSortIdx((i) => (i + 1) % SORT_CYCLE.length);
    setPage(1);
  }

  return (
    <section className="animate-card-in [animation-delay:160ms]">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-title text-text-primary">
          Room breakdown — last 7 days
        </h2>
        <Button variant="ghost" size="sm" onClick={cycleSort}>
          Sort: {sort.label}
        </Button>
      </div>
      <Card padding="lg">
        <Table>
          <Thead>
            <Tr>
              <Th>Room</Th>
              <Th>Type</Th>
              <Th align="right">Floor</Th>
              <Th align="right">Vacancy</Th>
              <Th align="right">Wasted</Th>
              <Th align="right">Save w/ KETIC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pageRows.length === 0 && (
              <Tr>
                <Td className="text-text-muted" colSpan={6}>
                  No vacancy events in this period
                </Td>
              </Tr>
            )}
            {pageRows.map((r) => (
              <Tr key={r.room_number} interactive>
                <Td className="font-medium text-text-primary">{r.room_number}</Td>
                <Td className="text-text-muted">{r.room_type ?? "—"}</Td>
                <Td align="right" className="text-text-muted tnum">
                  {r.floor ?? "—"}
                </Td>
                <Td align="right" className="tnum text-text-primary">
                  {formatHours(r.vacancy_hours)}
                </Td>
                <Td align="right" className="tnum font-medium text-data-waste">
                  {formatCurrency(r.cost_wasted, true)}
                </Td>
                <Td align="right" className="tnum font-medium text-data-save">
                  {formatCurrency(r.ketic_would_save, true)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-end gap-4 border-t border-border-subtle pt-4">
            <span className="text-micro text-text-muted">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
