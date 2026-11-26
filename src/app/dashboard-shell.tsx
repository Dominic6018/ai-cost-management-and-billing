import type { ReactNode } from "react";
import type { SessionUser } from "@/db/auth";
import { DashboardNav } from "./dashboard-nav";

/**
 * The frame of every dashboard page: the sidebar, then the page's content
 * across the rest of the screen.
 */
export function DashboardShell({
  user,
  current,
  children,
}: {
  user: SessionUser;
  /** The page's path, e.g. "/spend", to mark where the account is. */
  current: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen lg:flex">
      <DashboardNav user={user} current={current} />
      <main className="min-w-0 flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
