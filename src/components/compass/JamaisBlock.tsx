import { fr } from "@/copy/fr";

type JamaisBlockProps = {
  topic: string;
  text: string;
  alternative: string;
};

export function JamaisBlock({ topic, text, alternative }: JamaisBlockProps) {
  return (
    <aside className="border-y-2 border-ink py-5">
      <p className="font-mono text-xs leading-5 text-ink-2">{fr.never.label}</p>
      <h3 className="mt-2 font-display text-2xl leading-tight text-ink">{topic}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-2">{text}</p>
      <p className="mt-4 text-sm leading-6 text-ink-2">
        <span className="font-semibold text-ink">{fr.never.action} :</span> {alternative}
      </p>
    </aside>
  );
}