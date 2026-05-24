import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { PasswordGate } from "@/components/admin/PasswordGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/Card";
import { SyncButton } from "@/components/admin/SyncButton";
import { formatRelativeDate } from "@/lib/format";
import type { Property } from "@/lib/supabase/types";

export const revalidate = 0;

export default async function AdminPropertyPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!isAdminAuthenticated()) {
    return <PasswordGate />;
  }

  const supabase = createServerClient();
  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle<Property>();

  if (!property) notFound();

  const { count: eventCount } = await supabase
    .from("room_events")
    .select("id", { count: "exact", head: true })
    .eq("property_id", property.id);

  return (
    <AdminShell>
      <div className="mb-2 text-label uppercase text-text-muted">Property</div>
      <h1 className="text-title text-text-primary">{property.name}</h1>
      <div className="mt-1 text-body text-text-muted">{property.location}</div>

      <div className="mt-8 grid grid-cols-3 gap-6">
        <Card padding="lg">
          <div className="text-label uppercase text-text-muted">Rooms</div>
          <div className="mt-3 text-headline tnum text-text-primary">
            {property.room_count}
          </div>
        </Card>
        <Card padding="lg">
          <div className="text-label uppercase text-text-muted">Events</div>
          <div className="mt-3 text-headline tnum text-text-primary">
            {eventCount ?? 0}
          </div>
        </Card>
        <Card padding="lg">
          <div className="text-label uppercase text-text-muted">Last sync</div>
          <div className="mt-3 text-body text-text-primary">
            {formatRelativeDate(property.last_synced_at)}
          </div>
        </Card>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-border-subtle pt-6">
        <Link
          href={`/dashboard/${property.slug}`}
          className="text-body text-text-muted transition-colors hover:text-text-primary"
        >
          View dashboard ↗
        </Link>
        <SyncButton propertyId={property.id} />
      </div>
    </AdminShell>
  );
}
