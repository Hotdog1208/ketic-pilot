"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type Props = {
  children: React.ReactNode;
};

export function AdminShell({ children }: Props) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 flex h-screen w-[220px] flex-col border-r border-border-subtle bg-bg-surface px-5 py-6">
        <div className="text-label uppercase text-text-muted">Ketic admin</div>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          <Link
            href="/admin"
            className="rounded-md px-3 py-2 text-body text-text-primary transition-colors hover:bg-bg-elevated"
          >
            Properties
          </Link>
          <span className="rounded-md px-3 py-2 text-body text-text-faint">
            Logs
          </span>
        </nav>
        <div className="border-t border-border-subtle pt-4">
          <div className="text-micro text-text-muted">Logged in</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="mt-1 px-0"
          >
            Log out
          </Button>
        </div>
      </aside>
      <main className="ml-[220px] px-12 py-12">{children}</main>
    </div>
  );
}
