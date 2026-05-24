import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 64);
}

export async function POST(req: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as
    | {
        name?: string;
        location?: string;
        room_count?: number;
        pms_type?: string;
        api_key?: string;
      }
    | null;

  if (!body || !body.name || !body.location || !body.room_count) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const supabase = createServerClient();
  const baseSlug = slugify(`${body.name}-${body.location}`);
  const slug = baseSlug || `property-${Date.now()}`;

  const { data, error } = await supabase
    .from("properties")
    .insert({
      slug,
      name: body.name,
      location: body.location,
      room_count: body.room_count,
      pms_type: body.pms_type ?? "cloudbeds",
      api_key: body.api_key ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, property: data });
}
