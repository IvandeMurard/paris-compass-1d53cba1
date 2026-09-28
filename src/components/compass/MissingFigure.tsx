import { fr } from "@/copy/fr";
import { SourceLine, type SourceLineProps } from "./SourceLine";

type MissingFigureProps = SourceLineProps & {
  label: string;
  scale: string;
  reason: string;
};

export function MissingFigure({ label, scale, reason, source, licence, asOf }: MissingFigureProps) {
  return (
    <figure className="border-t-2 border-ink pt-4">
      <figcaption className="text-sm font-semibold text-ink-2">{label}</figcaption>
      <div className="mt-4 flex items-end justify-between gap-4 border-b border-rule pb-4">
        <span className="font-display text-4xl leading-none text-ink">{fr.figure.missing}</span>
        <span className="pb-1 font-mono text-xs text-ink-2">{scale}</span>
      </div>
      <p className="mt-3 font-display text-base leading-6 text-ink-2">{reason}</p>
      <div className="mt-4">
        <SourceLine source={source} licence={licence} asOf={asOf} />
      </div>
    </figure>
  );
}