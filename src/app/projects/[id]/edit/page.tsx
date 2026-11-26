import type { Metadata } from "next";
import { DashboardShell } from "../../../dashboard-shell";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { getProject } from "@/db/projects";
import { organizationScope } from "@/db/scope";
import { requirePermission } from "@/lib/auth";
import { updateProjectAction } from "../../actions";
import { ProjectForm } from "../../project-form";

export const metadata: Metadata = {
  title: "Edit project",
};

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requirePermission(
    "projects:manage",
    `/projects/${id}/edit`,
  );
  const project = await getProject(db, organizationScope(user), id);
  if (!project) notFound();

  return (
    <DashboardShell user={user} current="/projects">
      <div className="flex max-w-3xl flex-col gap-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Edit {project.name}
        </h1>
        <ProjectForm
          action={updateProjectAction.bind(null, project.id)}
          initialValues={{
            name: project.name,
            slug: project.slug,
            monthlyBudgetUsd: project.monthlyBudgetUsd ?? "",
            runBudgetUsd: project.runBudgetUsd ?? "",
          }}
          submitLabel="Save changes"
        />
      </div>
    </DashboardShell>
  );
}
