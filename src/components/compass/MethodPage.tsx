import { ConfidenceMark, type Confidence } from "./ConfidenceMark";
import { fr } from "@/copy/fr";
import { getAddress, shared } from "@/data/fixture";

const referenceAddress = getAddress("82-place-du-docteur-felix-lobligeois");

const sectionLinks = [
  ["principes", fr.method.sections.principles],
  ["formules", fr.method.sections.formulas],
  ["sources", fr.method.sections.sources],
  ["fiabilite", fr.method.sections.reliability],
  ["retenu", fr.method.sections.retained],
] as const;

const confidenceLevels = ["etabli", "corrobore", "probable", "indetermine"] as const;

function MethodSection({ id, number, title, lead, children }: { id: string; number: string; title: string; lead: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 border-t-2 border-ink py-12 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-12">
        <div>
          <p className="font-mono text-xs text-ink-2">{number}</p>
          <h2 className="mt-2 font-display text-3xl leading-none text-ink sm:text-4xl">{title}</h2>
        </div>
        <div className="min-w-0">
          <p className="max-w-3xl font-display text-2xl leading-8 text-ink sm:text-3xl sm:leading-10">{lead}</p>
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </section>
  );
}

function KeyValues({ values }: { values: Record<string, string | number | null | undefined> }) {
  return (
    <dl className="grid gap-x-6 gap-y-2 font-mono text-xs leading-5 text-ink-2 sm:grid-cols-2">
      {Object.entries(values).map(([key, value]) => (
        <div key={key} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-rule py-2">
          <dt className="min-w-0 break-words">{key}</dt>
          <dd className="break-all text-right text-ink">{formatExampleValue(key, value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function formatExampleValue(key: string, value: string | number | null | undefined) {
  if (typeof value !== "number") return String(value);
  if (key === "d") return String(Math.round(value));
  if (key === "Σ") return value.toFixed(1);
  return String(value);
}

export function MethodPage() {
  if (!referenceAddress) return null;
  const retainedVintages = shared.vintages.rows.filter((row) => row.vintage_year === 2017 || row.vintage_year === 2020);

  return (
    <main className="bg-paper">
      <header className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-20">
        <p className="font-mono text-xs text-ink-2">{fr.method.kicker}</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl leading-none text-ink sm:text-7xl">{fr.method.title}</h1>
        <p className="mt-8 max-w-2xl font-display text-2xl leading-8 text-ink-2">{fr.method.intro}</p>
        <nav aria-label={fr.method.navigation} className="mt-12 grid border-y border-ink sm:grid-cols-2 lg:grid-cols-3">
          {sectionLinks.map(([id, label], index) => (
            <a key={id} href={`#${id}`} className="flex min-h-14 items-center justify-between gap-4 border-b border-rule px-3 text-sm text-ink transition-colors hover:bg-field sm:border-r sm:last:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0">
              <span>{label}</span><span className="font-mono text-xs text-ink-2">0{index + 1}</span>
            </a>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <MethodSection id="principes" number="01" title={fr.method.sections.principles} lead={fr.method.leads.principles}>
          <ol className="divide-y divide-rule border-y border-ink">
            {fr.method.principleItems.map(([title, text], index) => (
              <li key={title} className="grid gap-2 py-5 sm:grid-cols-[44px_180px_minmax(0,1fr)] sm:gap-5">
                <span className="font-mono text-xs text-ink-2">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-semibold text-ink">{title}</h3>
                <p className="text-sm leading-6 text-ink-2">{text}</p>
              </li>
            ))}
          </ol>
        </MethodSection>

        <MethodSection id="formules" number="02" title={fr.method.sections.formulas} lead={fr.method.leads.formulas}>
          <p className="mb-8 font-mono text-xs leading-5 text-ink-2">{fr.method.referenceAddress} · {referenceAddress.address.label}</p>
          <div className="divide-y-2 divide-ink border-y-2 border-ink">
            {referenceAddress.dossier.figures.map((figure, index) => (
              <article key={figure.axis} className="py-8">
                <div className="grid gap-3 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-baseline">
                  <span className="font-mono text-xs text-ink-2">{String(index + 1).padStart(2, "0")}</span>
                   <h3 className="font-display text-3xl text-ink">{fr.method.formulaNames[figure.axis as keyof typeof fr.method.formulaNames]}</h3>
                   {figure.value !== null ? <span className="font-mono text-xs text-ink-2">{figure.value} / 100</span> : null}
                </div>
                 {figure.axis === "footfall" && "note" in figure && figure.note ? <p className="mt-5 border-l-2 border-ink pl-4 text-sm leading-6 text-ink-2">{figure.note}</p> : null}
                <dl className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div><dt className="font-mono text-xs text-ink-2">{fr.method.formula}</dt><dd className="mt-2 break-words font-mono text-sm leading-6 text-ink">{figure.derivation.formula}</dd></div>
                   <div><dt className="font-mono text-xs text-ink-2">{fr.addressSheet.calculation}</dt><dd className="mt-2 font-mono text-sm text-ink">{fr.figure.methods[figure.method as keyof typeof fr.figure.methods]}</dd></div>
                  <div><dt className="font-mono text-xs text-ink-2">{fr.method.radius}</dt><dd className="mt-2 font-mono text-sm text-ink">{String(figure.derivation.radiusM)} m</dd></div>
                  <div><dt className="mb-2 font-mono text-xs text-ink-2">{fr.method.constants}</dt><dd><KeyValues values={figure.derivation.constants} /></dd></div>
                  <div><dt className="mb-2 font-mono text-xs text-ink-2">{fr.method.operands}</dt><dd><KeyValues values={figure.derivation.operands} /></dd></div>
                </dl>
              </article>
            ))}
          </div>
        </MethodSection>

        <MethodSection id="sources" number="03" title={fr.method.sections.sources} lead={fr.method.leads.sources}>
          <div className="divide-y divide-rule border-y-2 border-ink">
            {shared.sourceFreshness.rows.map((row) => (
              <article key={row.source} className="grid gap-4 py-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10">
                <div><p className="font-mono text-xs text-ink-2">{row.source}</p><h3 className="mt-2 font-display text-2xl leading-7 text-ink">{row.label}</h3></div>
                <div>
                  <p className="font-mono text-xs text-ink-2">
                    {fr.method.sourceCadence} · {fr.method.cadences[row.cadence as keyof typeof fr.method.cadences]}
                    {row.source === "filosofi" ? null : <> · {fr.method.sourceAsOf} · {row.source_as_of}</>}
                  </p>
                  {row.source === "filosofi" ? <div className="mt-3"><ConfidenceMark level="indetermine" /></div> : null}
                  <p className="mt-3 text-sm leading-6 text-ink-2">{row.publicNote}</p>
                </div>
              </article>
            ))}
          </div>
        </MethodSection>

        <MethodSection id="fiabilite" number="04" title={fr.method.sections.reliability} lead={fr.method.leads.reliability}>
          <div className="grid border-y-2 border-ink sm:grid-cols-2">
            {confidenceLevels.map((level, index) => (
              <article key={level} className={`min-h-40 border-b border-rule p-5 ${index % 2 === 0 ? "sm:border-r" : ""}`}>
                <ConfidenceMark level={level as Confidence} />
                <p className="mt-4 font-display text-xl leading-7 text-ink">{fr.method.confidenceDefinitions[level]}</p>
              </article>
            ))}
          </div>
        </MethodSection>

        <MethodSection id="retenu" number="05" title={fr.method.sections.retained} lead={fr.method.leads.retained}>
          <div className="divide-y divide-rule border-y-2 border-ink">
            {retainedVintages.map((row) => (
              <article key={row.vintage_year} className="grid gap-5 py-7 sm:grid-cols-[140px_minmax(0,1fr)]">
                <div><p className="font-mono text-xs text-ink-2">{fr.method.vintage}</p><p className="mt-1 font-display text-4xl text-ink">{row.vintage_year}</p></div>
                <div><p className="font-mono text-xs leading-5 text-ink-2">{fr.method.licence} · licence propre (non lue) · {fr.method.asOf} · {row.vintage_year}</p><p className="mt-4 border-l border-dashed border-ink pl-4 font-display text-xl leading-7 text-ink-2">{row.licence_note}</p></div>
              </article>
            ))}
          </div>
        </MethodSection>
      </div>
    </main>
  );
}