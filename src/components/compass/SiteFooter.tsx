import { Link } from "@tanstack/react-router";

import { fr } from "@/copy/fr";
import { shared } from "@/data/fixture";

const links = [
  { to: "/", label: fr.shell.home },
  { to: "/methode", label: fr.shell.method },
  { to: "/apprendre", label: fr.shell.learn },
  { to: "/kit", label: fr.shell.kit },
] as const;

export function SiteFooter({ variant = "full" }: { variant?: "full" | "sheet" }) {
  const sourceRows = shared.sourceFreshness.rows;

  return (
    <footer className={`compass-site-footer ${variant === "sheet" ? "w-full max-w-[520px] bg-paper lg:border-r lg:border-ink" : "bg-paper"}`}>
      <div className={variant === "full" ? "mx-auto max-w-6xl px-4 sm:px-8" : "px-4 sm:px-8"}>
        <div className="grid gap-8 border-t-2 border-ink py-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:py-10">
          <div className="min-w-0">
            <p className="font-display text-2xl leading-7">{fr.shell.brand}</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink-2">{fr.shell.footerStatement}</p>
          </div>
          <nav aria-label={fr.shell.footerNavigation} className="grid grid-cols-2 gap-x-6 sm:grid-cols-1 sm:text-right">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="flex min-h-11 items-center text-sm underline-offset-4 hover:underline sm:justify-end">{link.label}</Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-rule py-6">
          <p className="mb-3 font-mono text-xs uppercase text-ink-2">{fr.shell.sources}</p>
          <p className="font-mono text-xs leading-5 text-ink-2">
            {sourceRows.map((row, index) => (
              <span key={row.source}>{index > 0 ? " · " : ""}{row.label} — {fr.shell.sourceDate} {row.source_as_of}</span>
            ))}
          </p>
        </div>
        <div className="flex min-h-16 items-center border-t border-ink py-2">
          <a href="https://github.com/IvandeMurard/paris-compass/issues" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-sm underline decoration-1 underline-offset-4">{fr.shell.reportIssue}</a>
        </div>
      </div>
    </footer>
  );
}