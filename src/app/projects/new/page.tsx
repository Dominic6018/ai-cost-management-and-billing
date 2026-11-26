import type { Metadata } from "next";
import { DashboardShell } from "../../dashboard-shell";
import { requirePermission } from "@/lib/auth";
import { createProjectAction } from "../actions";
import { ProjectForm } from "../project-form";

export const metadata: Metadata = {
  title: "New project",
};

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const user = await requirePermission("projects:manage", "/projects/new");

  return (
    <DashboardShell user={user} current="/projects">
      <div className="flex max-w-3xl flex-col gap-8">
        <h1 className="text-3xl font-semibold tracking-tight">New project</h1>
        <ProjectForm
          action={createProjectAction}
          submitLabel="Create project"
        />
      </div>
    </DashboardShell>
  );
}
