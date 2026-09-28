import { fr } from "@/copy/fr";
import { SourceLine, type SourceLineProps } from "./SourceLine";

export type FigureMethod = keyof typeof fr.figure.methods;

type FigureProps = SourceLineProps & {
  label: string;
  value: string | number;
  scale: string;
  method: FigureMethod;
  note?: string;
};

export function Figure({ label, value, scale, source, licence, asOf, method, note }: FigureProps) {
  return (
    <figure className="border-t-2 border-ink pt-4">
      <figcaption className="text-sm font-semibold text-ink-2">{label}</figcaption>
      <div className="mt-4 flex items-end justify-between gap-4 border-b border-rule pb-4">
        <span className="font-display text-6xl leading-none text-ink">{value}</span>
        <span className="pb-1 font-mono text-xs text-ink-2">{scale}</span>
      </div>
      <p className="mt-3 font-mono text-xs text-ink-2">méthode · {fr.figure.methods[method]}</p>
      {method === "estimated" && note ? (
        <p className="mt-3 font-display text-base leading-6 text-ink-2">{note}</p>
      ) : null}
      <div className="mt-4">
        <SourceLine source={source} licence={licence} asOf={asOf} />
      </div>
    </figure>
  );
}