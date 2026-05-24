import { createServerClient } from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { PasswordGate } from "@/components/admin/PasswordGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { PropertyList } from "@/components/admin/PropertyList";
import type { Property } from "@/lib/supabase/types";

export const revalidate = 0;

export default async function AdminPage() {
  if (!isAdminAuthenticated()) {
    return <PasswordGate />;
  }

  const supabase = createServerClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  const properties: Property[] = data ?? [];

  return (
    <AdminShell>
      <PropertyList properties={properties} />
    </AdminShell>
  );
}
