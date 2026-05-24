"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type Props = {
  propertyId: string;
};

export function SyncButton({ propertyId }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function sync() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/sync/${propertyId}`, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setStatus(json.error ?? "Sync failed");
      } else {
        setStatus(`Synced ${json.synced} events`);
        router.refresh();
      }
    } catch (e) {
      setStatus("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {status && <span className="text-micro text-text-muted">{status}</span>}
      <Button variant="ghost" size="sm" onClick={sync} disabled={busy}>
        {busy ? "Syncing…" : "Sync now"}
      </Button>
    </div>
  );
}
