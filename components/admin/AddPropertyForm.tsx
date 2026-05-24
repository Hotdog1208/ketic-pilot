"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type Props = {
  onCancel: () => void;
};

export function AddPropertyForm({ onCancel }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [roomCount, setRoomCount] = useState("");
  const [pmsType, setPmsType] = useState("cloudbeds");
  const [apiKey, setApiKey] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        location,
        room_count: Number(roomCount),
        pms_type: pmsType,
        api_key: apiKey,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Failed to add property");
      return;
    }
    onCancel();
    router.refresh();
  }

  return (
    <Card padding="lg" className="mb-6">
      <h3 className="text-title text-text-primary">Add property</h3>
      <form onSubmit={onSubmit} className="mt-6 grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="mb-2 block text-label uppercase text-text-muted">
            Property name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="col-span-2">
          <label className="mb-2 block text-label uppercase text-text-muted">
            Location
          </label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-label uppercase text-text-muted">
            Room count
          </label>
          <Input
            type="number"
            min={1}
            value={roomCount}
            onChange={(e) => setRoomCount(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-label uppercase text-text-muted">
            PMS type
          </label>
          <Select value={pmsType} onChange={(e) => setPmsType(e.target.value)}>
            <option value="cloudbeds">Cloudbeds</option>
            <option value="mews" disabled>
              Mews — Coming soon
            </option>
            <option value="opera" disabled>
              Opera — Coming soon
            </option>
          </Select>
        </div>
        <div className="col-span-2">
          <label className="mb-2 block text-label uppercase text-text-muted">
            API key
          </label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        {error && (
          <div className="col-span-2 text-micro text-data-waste">{error}</div>
        )}
        <div className="col-span-2 mt-2 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="text-body text-text-muted transition-colors hover:text-text-primary"
          >
            Cancel
          </button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Adding…" : "Add property"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
