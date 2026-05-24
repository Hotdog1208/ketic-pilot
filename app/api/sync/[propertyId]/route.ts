import { NextResponse } from "next/server";
import { syncProperty } from "@/lib/cloudbeds/sync";
import { isAdminAuthenticated } from "@/lib/admin-auth";

function authorizedByServiceRole(req: Request): boolean {
  const header = req.headers.get("authorization");
  const expected = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!header || !expected) return false;
  const token = header.replace(/^Bearer\s+/i, "").trim();
  return token === expected;
}

export async function POST(
  req: Request,
  { params }: { params: { propertyId: string } },
) {
  const authorized = authorizedByServiceRole(req) || isAdminAuthenticated();
  if (!authorized) {
    return NextResponse.json(
      { success: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  try {
    const result = await syncProperty(params.propertyId);
    return NextResponse.json({
      success: true,
      synced: result.synced,
      errors: result.errors,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
