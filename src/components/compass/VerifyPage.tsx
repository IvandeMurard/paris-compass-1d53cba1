import { useState } from "react";
import type { ChangeEvent, DragEvent } from "react";

import { fr } from "@/copy/fr";

export function VerifyPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const v = fr.pages.verify;

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  };

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const exampleRows: ReadonlyArray<readonly [string, string]> = [
    [v.ref, "REF-EXEMPLE"],
    [v.issued, "1er octobre 2026"],
    [v.initials, "A. B."],
    [v.hashRecorded, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"],
    [v.hashYours, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"],
    [`${v.result} (exemple)`, v.match],
  ];

  return (
    <main className="mx-auto min-h-[32rem] max-w-6xl bg-paper px-4 py-10 sm:px-8 sm:py-14">
      <p className="-mx-4 -mt-10 mb-10 border-b-2 border-ink bg-field px-4 py-2 text-center font-mono text-xs uppercase tracking-wide text-ink-2 sm:-mx-8 sm:-mt-14 sm:px-8">{v.banner}</p>
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase text-ink-2">{v.eyebrow}</p>
        <h1 className="mt-5 font-display text-4xl leading-none sm:text-6xl">{v.title}</h1>
        <p className="mt-6 border-t border-ink pt-5 text-sm leading-6 text-ink-2">{v.lead}</p>

        <form className="mt-10" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="verifier-ref" className="block text-sm font-medium">{v.refLabel}</label>
          <input id="verifier-ref" name="reference" type="text" autoComplete="off" placeholder={v.refPlaceholder} className="mt-2 min-h-11 w-full border border-ink bg-document px-3 text-sm placeholder:text-muted" />

          <p className="mt-8 block text-sm font-medium" id="verifier-file-label">{v.fileLabel}</p>
          <label
            aria-labelledby="verifier-file-label"
            onDragOver={(event) => event.preventDefault()}
            onDrop={onDrop}
            className="mt-2 flex min-h-44 cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-ink bg-field px-4 py-8 text-center"
          >
            <input type="file" accept=".pdf,application/pdf" className="sr-only" onChange={onPick} />
            <span className="font-display text-2xl">{v.dropTitle}</span>
            <span className="text-sm text-ink-2 underline decoration-1 underline-offset-4">{v.dropAction}</span>
            <span className="text-sm text-ink-2">{v.dropText}</span>
          </label>
          {fileName ? (
            <p className="mt-3 text-sm leading-6 text-ink-2">
              <span className="font-mono text-xs uppercase">{v.chosen}</span> {fileName} — {v.chosenNote}
            </p>
          ) : null}
          <p className="mt-3 font-mono text-xs leading-5 text-ink-2">{v.localNote}</p>
        </form>

        <section aria-label={v.exampleTitle} className="mt-12 border-t-2 border-ink pt-8">
          <h2 className="font-display text-2xl leading-7">{v.exampleTitle}</h2>
          <p className="mt-2 font-mono text-xs leading-5 text-ink-2">{v.exampleNote}</p>
          <dl className="mt-6 space-y-4">
            {exampleRows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-ink-2">{label}</dt>
                <dd className="mt-1 break-all font-mono text-xs leading-5 text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
