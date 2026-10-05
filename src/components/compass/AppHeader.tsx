import { Link } from "@tanstack/react-router";

import { fr } from "@/copy/fr";

const links = [
  { to: "/", label: fr.shell.home },
  { to: "/methode", label: fr.shell.method },
  { to: "/apprendre", label: fr.shell.learn },
] as const;

export function AppHeader() {
  return (
    <header className="compass-app-header border-b-2 border-ink bg-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-4 sm:flex sm:min-h-16 sm:justify-between sm:px-8">
        <Link to="/" className="flex min-h-14 min-w-0 items-center font-display text-2xl leading-none">
          <span className="truncate">{fr.shell.brand}</span>
        </Link>
        <span className="font-mono text-xs text-ink-2 sm:hidden">PARIS</span>
        <nav aria-label={fr.shell.navigation} className="col-span-2 -mx-4 grid grid-cols-3 border-t border-rule sm:col-auto sm:mx-0 sm:flex sm:border-t-0">
          {links.map((link) => (
            <Link key={link.to} to={link.to} activeOptions={{ exact: link.to === "/" }} className="flex min-h-11 min-w-0 items-center justify-center px-2 text-sm text-ink-2 transition-colors hover:bg-field hover:text-ink sm:min-w-11 sm:px-3" activeProps={{ className: "bg-field text-ink underline decoration-1 underline-offset-4" }}>
              <span className="truncate">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}