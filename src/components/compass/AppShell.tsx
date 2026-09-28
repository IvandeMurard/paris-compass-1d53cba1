import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { AppHeader } from "./AppHeader";
import { SiteFooter } from "./SiteFooter";

export function AppShell({ children }: { children: ReactNode }) {
  const isAddressSheet = useRouterState({ select: (state) => state.location.pathname.startsWith("/contexte/") });
  return (
    <div className="flex min-h-screen min-w-0 flex-col bg-ground text-ink">
      <AppHeader />
      <div className="min-w-0 flex-1">{children}</div>
      <SiteFooter variant={isAddressSheet ? "sheet" : "full"} />
    </div>
  );
}