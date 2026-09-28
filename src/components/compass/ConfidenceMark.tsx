import { fr } from "@/copy/fr";

export type Confidence = keyof typeof fr.confidence;

const markStyles: Record<Confidence, string> = {
  etabli: "border-confidence bg-confidence",
  corrobore: "border-confidence-light bg-confidence-light",
  probable: "border-confidence bg-transparent",
  indetermine: "border-muted bg-transparent border-dashed",
};

export function ConfidenceMark({ level }: { level: Confidence }) {
  return (
    <span className="inline-flex min-h-11 items-center gap-2 font-sans text-sm text-ink-2">
      <span
        aria-hidden="true"
        className={`size-3 shrink-0 rounded-full border-2 ${markStyles[level]}`}
      />
      <span>{fr.confidence[level]}</span>
    </span>
  );
}