import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fr } from "@/copy/fr";
import type { AddressFixture } from "@/data/fixture";
import { ConfidenceMark, type Confidence } from "./ConfidenceMark";
import { RetenuBlock } from "./RetenuBlock";
import { SourceLine } from "./SourceLine";

type FigureRow = AddressFixture["dossier"]["figures"][number];
type TimelineRow = AddressFixture["unitTimeline"]["rows"][number];

const t = fr.pages.dossier;
const formatDate = (value: string) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(value));
const formatMoney = (value: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

function SectionTitle({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="mb-7 grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-ink pb-3">
      <span className="font-mono text-xs text-ink-2">{number}</span>
      <h2 className="font-display text-2xl leading-none text-ink sm:text-3xl">{children}</h2>
    </div>
  );
}

function DossierFigure({ figure }: { figure: FigureRow }) {
  const missing = figure.value === null;
  return (
    <article className="dossier-keep border-t border-rule pt-4">
      <p className="text-sm font-semibold text-ink-2">{figure.label}</p>
      <div className="mt-3 flex min-w-0 items-end justify-between gap-3">
        <p className="min-w-0 break-words font-display text-4xl leading-none text-ink">
          {missing ? fr.figure.missing : figure.value}
        </p>
        <p className="shrink-0 font-mono text-xs text-ink-2">{figure.scale}</p>
      </div>
      {figure.counts ? <p className="mt-3 text-sm leading-6 text-ink-2">{figure.counts}</p> : null}
      {missing && "missingReason" in figure ? <p className="mt-3 text-sm leading-6 text-ink-2">{figure.missingReason}</p> : null}
      <p className="mt-3 font-mono text-xs text-ink-2">méthode · {fr.figure.methods[figure.method]}</p>
      <div className="mt-3"><SourceLine source={figure.source} licence={figure.licence} asOf={figure.asOf} /></div>
    </article>
  );
}

function TimelineItem({ row }: { row: TimelineRow }) {
  if (row.withheld) {
    return (
      <li className="dossier-keep border-t border-rule py-5">
        <p className="mb-3 font-mono text-xs text-ink-2">{formatDate(`${row.occurred_on}T12:00:00`)} · {row.source}</p>
        <RetenuBlock evidence={row.evidence} />
      </li>
    );
  }

  const kind = row.kind === "sale" ? t.sale : row.kind === "survey" ? t.survey : t.proceeding;
  return (
    <li className="dossier-keep border-t border-rule py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs text-ink-2">{formatDate(`${row.occurred_on}T12:00:00`)} · {kind}</p>
          <h3 className="mt-2 break-words font-display text-xl leading-6 text-ink">{row.label ?? t.unavailable}</h3>
          {row.detail ? <p className="mt-2 text-sm leading-6 text-ink-2">{row.detail}</p> : null}
        </div>
        {row.amount_eur !== null ? <p className="shrink-0 font-display text-2xl text-ink">{formatMoney(row.amount_eur)}</p> : null}
      </div>
      <div className="mt-2"><ConfidenceMark level={row.confidence as Confidence} /></div>
      <p className="text-sm leading-6 text-ink-2">{row.confidence_reason}</p>
      <div className="mt-3"><SourceLine source={row.source} licence={row.source_licence} asOf={row.occurred_on} /></div>
    </li>
  );
}

export function DossierPage({ address }: { address: AddressFixture }) {
  const dossier = address.dossier;
  const timeline = [...address.unitTimeline.rows].sort((a, b) => a.occurred_on.localeCompare(b.occurred_on));
  const maxBucket = Math.max(...dossier.rythme.shape.buckets.map((bucket) => bucket.pct), 1);

  return (
    <main className="dossier-screen bg-ground px-4 py-6 sm:px-8 sm:py-10">
      <div className="dossier-toolbar mx-auto mb-4 flex max-w-[210mm] justify-end">
        <Button type="button" variant="outline" className="min-h-11 rounded-none border-ink bg-document shadow-none" onClick={() => window.print()}>
          <Printer aria-hidden="true" />{t.print}
        </Button>
      </div>

      <article className="dossier-document mx-auto w-full max-w-[210mm] bg-document px-5 py-10 text-ink sm:px-12 sm:py-14 lg:px-[18mm] lg:py-[16mm]">
        <header className="dossier-cover flex min-h-[220px] flex-col justify-between border-b-2 border-ink pb-8 sm:min-h-[280px]">
          <p className="font-mono text-xs uppercase text-ink-2">{t.title}</p>
          <div className="mt-12">
            <h1 className="max-w-2xl break-words font-display text-4xl leading-[0.95] text-ink sm:text-6xl">{address.address.label}</h1>
            <p className="mt-6 font-mono text-xs text-ink-2">{t.issued} {formatDate(dossier.issuedAt)}</p>
            <div className="mt-2"><SourceLine source={`${t.addressSource} · ${dossier.address.source}`} licence={dossier.address.licence} /></div>
          </div>
        </header>

        <section className="dossier-section py-10 sm:py-12">
          <SectionTitle number="01">{t.summary}</SectionTitle>
          <p className="max-w-3xl font-display text-2xl leading-8 text-ink sm:text-3xl sm:leading-10">{dossier.verdict.sentence}</p>
          <div className="mt-10">
            <h3 className="mb-6 font-mono text-xs uppercase text-ink-2">{t.findings}</h3>
            <div className="grid gap-8 sm:grid-cols-2">{dossier.figures.map((figure) => <DossierFigure key={figure.axis} figure={figure} />)}</div>
          </div>
        </section>

        <section className="dossier-section border-t-2 border-ink py-10 sm:py-12">
          <SectionTitle number="02">{t.history}</SectionTitle>
          <ol>{timeline.map((row) => <TimelineItem key={`${row.occurred_on}-${row.kind}-${row.source_ref}`} row={row} />)}</ol>
        </section>

        <section className="dossier-section border-t-2 border-ink py-10 sm:py-12">
          <SectionTitle number="03">{t.rhythm}</SectionTitle>
          <p className="font-mono text-xs text-ink-2">{dossier.rythme.shape.stationName} · {dossier.rythme.shape.distanceM} m · {dossier.rythme.shape.dayType}</p>
          <div className="mt-7 flex h-36 items-end gap-px border-b border-ink" aria-label={t.departures}>
            {dossier.rythme.shape.buckets.map((bucket) => <div key={bucket.hour} className="min-w-0 flex-1 bg-confidence" style={{ height: `${Math.max(2, bucket.pct / maxBucket * 100)}%` }} title={`${bucket.label} · ${bucket.pct} %`} />)}
          </div>
          <p className="mt-3 font-mono text-xs text-ink-2">{t.departures}</p>
          <p className="mt-6 font-display text-xl leading-7 text-ink">{dossier.rythme.reading}</p>
          <p className="mt-4 border-l-2 border-ink pl-4 text-sm leading-6 text-ink-2">{dossier.rythme.note}</p>
          <div className="mt-4"><SourceLine source={dossier.rythme.source} licence={dossier.rythme.licence} asOf={dossier.rythme.asOf} /></div>
        </section>

        {dossier.gaps.length > 0 ? (
          <section className="dossier-section border-t-2 border-ink py-10 sm:py-12">
            <SectionTitle number="04">{t.limits}</SectionTitle>
            <div className="grid gap-4">{dossier.gaps.map((gap) => <aside key={gap.axis} className="dossier-keep border border-dashed border-ink p-4"><p className="font-mono text-xs text-ink-2">{gap.axis} · {gap.because}</p><p className="mt-3 text-sm leading-6 text-ink-2">{gap.reason}</p></aside>)}</div>
          </section>
        ) : null}

        <section className="dossier-section border-t-2 border-ink py-10 sm:py-12">
          <SectionTitle number={dossier.gaps.length > 0 ? "05" : "04"}>{t.method}</SectionTitle>
          <div className="grid gap-8 sm:grid-cols-2">
            <p className="text-sm leading-6 text-ink-2">{dossier.reproduce.methodology}</p>
            <p className="text-sm leading-6 text-ink-2">{dossier.doctrine}</p>
          </div>
        </section>
      </article>
    </main>
  );
}