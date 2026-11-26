import type { Metadata } from "next";
import { DashboardShell } from "../../dashboard-shell";
import Link from "next/link";
import { requirePermission } from "@/lib/auth";
import { addPriceAction } from "../actions";
import { PriceForm } from "../price-form";

export const metadata: Metadata = {
  title: "Add a price",
};

export const dynamic = "force-dynamic";

export default async function NewPricePage() {
  const user = await requirePermission("prices:manage", "/prices/new");

  return (
    <DashboardShell user={user} current="/prices">
      <div className="flex max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Link href="/prices" className="text-sm text-foreground/60 underline">
            Prices
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">Add a price</h1>
        </div>
        <p className="max-w-2xl text-sm text-foreground/70">
          Rates are USD per million tokens, copied exactly from the
          provider&apos;s pricing page. A new price ends the model&apos;s
          earlier price where it starts. Usage already recorded keeps its cost;
          the price applies to usage recorded from now on.
        </p>
        <PriceForm action={addPriceAction} />
      </div>
    </DashboardShell>
  );
}
