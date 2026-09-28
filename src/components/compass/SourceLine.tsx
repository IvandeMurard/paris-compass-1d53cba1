export type SourceLineProps = {
  source: string;
  licence: string;
  asOf?: string | undefined;
};

export function SourceLine({ source, licence, asOf }: SourceLineProps) {
  return (
    <p className="font-mono text-xs leading-5 text-ink-2">
      {source} · {licence} · {asOf ?? "date non fournie"}
    </p>
  );
}