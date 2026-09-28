import { createFileRoute, Outlet } from "@tanstack/react-router";

import { fr } from "@/copy/fr";
import { getAddress } from "@/data/fixture";

export const Route = createFileRoute("/contexte/$slug")({ component: ContextLayout });

function ContextLayout() {
  const { slug } = Route.useParams();
  if (!getAddress(slug)) {
    return (
      <main className="min-h-[32rem] w-full max-w-[520px] bg-paper px-4 py-12 sm:px-8 sm:py-16 lg:border-r lg:border-ink">
        <h1 className="font-display text-4xl leading-none sm:text-5xl">{fr.pages.context.absent}</h1>
      </main>
    );
  }
  return <Outlet />;
}