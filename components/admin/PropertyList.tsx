"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { SyncButton } from "./SyncButton";
import { AddPropertyForm } from "./AddPropertyForm";
import { formatRelativeDate } from "@/lib/format";
import type { Property } from "@/lib/supabase/types";

type Props = {
  properties: Property[];
};

export function PropertyList({ properties }: Props) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-title text-text-primary">Properties</h1>
        {!showAdd && (
          <Button variant="primary" onClick={() => setShowAdd(true)}>
            Add property
          </Button>
        )}
      </div>

      {showAdd && <AddPropertyForm onCancel={() => setShowAdd(false)} />}

      <Card padding="lg">
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Location</Th>
              <Th align="right">Rooms</Th>
              <Th>PMS</Th>
              <Th>Last sync</Th>
              <Th align="right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {properties.length === 0 && (
              <Tr>
                <Td className="text-text-muted" colSpan={6}>
                  No properties yet
                </Td>
              </Tr>
            )}
            {properties.map((p) => (
              <Tr key={p.id} interactive>
                <Td className="font-medium text-text-primary">{p.name}</Td>
                <Td className="text-text-muted">{p.location}</Td>
                <Td align="right" className="tnum text-text-muted">
                  {p.room_count}
                </Td>
                <Td className="text-text-muted capitalize">{p.pms_type}</Td>
                <Td className="text-text-muted">
                  {formatRelativeDate(p.last_synced_at)}
                </Td>
                <Td align="right">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/dashboard/${p.slug}`}
                      className="text-body text-text-muted transition-colors hover:text-text-primary"
                    >
                      View dashboard
                    </Link>
                    <SyncButton propertyId={p.id} />
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
