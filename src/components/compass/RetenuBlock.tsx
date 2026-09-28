import { fr } from "@/copy/fr";

export function RetenuBlock({ evidence }: { evidence: string }) {
  return (
    <aside className="border border-dashed border-ink px-4 py-4">
      <p className="font-mono text-xs leading-5 text-ink-2">{fr.retained.label}</p>
      <p className="mt-3 font-display text-lg leading-7 text-ink-2">{evidence}</p>
    </aside>
  );
}