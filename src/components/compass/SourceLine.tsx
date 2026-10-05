export type SourceLineProps = {
  source: string;
  licence: string;
  asOf?: string | undefined;
};

export function SourceLine({ source, licence, asOf }: SourceLineProps) {
  const publicLicence = licence === "custom" ? "licence propre (non lue)" : licence;
  return (
    <p className="font-mono text-xs leading-5 text-ink-2">
      {source} · {publicLicence} · {asOf ?? "date non fournie"}
    </p>
  );
}