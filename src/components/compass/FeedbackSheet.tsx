import { useEffect, useRef, useState } from "react";

import { fr } from "@/copy/fr";

export function FeedbackSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    setSent(false);
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const f = fr.feedback;

  return (
    <div role="dialog" aria-modal="true" aria-label={f.title} className="fixed inset-0 z-50">
      <button type="button" aria-label={f.close} onClick={onClose} className="absolute inset-0 h-full w-full cursor-default bg-ink/50" />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-xl border-2 border-b-0 border-ink bg-paper">
        <div className="flex items-center justify-between gap-4 border-b border-rule px-4 py-1 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-wide text-ink-2">{f.banner}</p>
          <button ref={closeRef} type="button" onClick={onClose} className="flex min-h-11 items-center px-2 text-sm underline decoration-1 underline-offset-4">{f.close}</button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-4 py-6 sm:px-6">
          {sent ? (
            <div>
              <h2 className="font-display text-3xl leading-none">{f.confirmation.title}</h2>
              <p className="mt-5 border-t border-ink pt-4 text-sm leading-6 text-ink-2">{f.confirmation.text}</p>
              <button type="button" onClick={onClose} className="mt-6 inline-flex min-h-11 items-center border-2 border-ink bg-ink px-5 text-sm text-paper hover:bg-ink-2">{f.close}</button>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
              <h2 className="font-display text-3xl leading-none">{f.title}</h2>
              <p className="mt-4 text-sm leading-6 text-ink-2">{f.intro}</p>
              <fieldset className="mt-6">
                <legend className="text-sm font-medium">{f.kindLabel}</legend>
                <div className="mt-1 flex flex-wrap gap-x-6">
                  {(["erreur", "avis", "idee"] as const).map((key) => (
                    <label key={key} className="flex min-h-11 items-center gap-2 text-sm">
                      <input type="radio" name="feedback-kind" value={key} defaultChecked={key === "erreur"} className="h-4 w-4 accent-[var(--ink)]" />
                      {f.kinds[key]}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label htmlFor="feedback-message" className="mt-5 block text-sm font-medium">{f.messageLabel}</label>
              <textarea id="feedback-message" name="message" required rows={5} placeholder={f.messagePlaceholder} className="mt-2 w-full border border-ink bg-document p-3 text-sm placeholder:text-muted" />
              <p className="mt-3 font-mono text-xs leading-5 text-ink-2">{f.mockNote}</p>
              <button type="submit" className="mt-4 inline-flex min-h-11 items-center border-2 border-ink bg-ink px-6 text-sm text-paper hover:bg-ink-2">{f.submit}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
