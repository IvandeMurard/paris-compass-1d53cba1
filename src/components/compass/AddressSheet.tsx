import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

import { fr } from "@/copy/fr";
import { shared, type AddressFixture } from "@/data/fixture";
import { ConfidenceMark, type Confidence } from "./ConfidenceMark";
import { Figure, type FigureMethod } from "./Figure";
import { JamaisBlock } from "./JamaisBlock";
import { LeafletAddressMap, type MapView } from "./LeafletAddressMap";
import { MissingFigure } from "./MissingFigure";
import { RetenuBlock } from "./RetenuBlock";
import { SourceLine } from "./SourceLine";

type ChapterId = "verdict" | "before" | "today" | "tomorrow" | "around";
type FigureRow = AddressFixture["dossier"]["figures"][number];
type TimelineRow = AddressFixture["unitTimeline"]["rows"][number];
type SignalRow = AddressFixture["nearbySignals"]["rows"][number];

const viewByChapter: Record<ChapterId, MapView> = {
  verdict: "unit",
  before: "unit",
  today: "segment",
  tomorrow: "near",
  around: "wide",
};

const formatDate = (value: string) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(`${value}T12:00:00`));
const formatDistance = (value: number) => `${Math.round(value)} m`;
const formatMoney = (value: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
const entries = (value: object) => Object.entries(value).map(([key, item]) => `${key} = ${String(item)}`).join(" · ");
const neverAction = (topic: string) => topic === "Loyer commercial" ? fr.never.actions["Loyer commercial"] : fr.never.actions["Passage piéton"];

function Chapter({ id, number, title, onVisible, children }: { id: ChapterId; number: string; title: string; onVisible: (id: ChapterId) => void; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) onVisible(id);
    }, { rootMargin: "-24% 0px -60% 0px", threshold: 0 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [id, onVisible]);
  return (
    <section ref={ref} id={id} className="scroll-mt-20 border-t-2 border-ink px-4 py-10 sm:px-8 sm:py-14">
      <p className="font-mono text-xs text-ink-2">{number}</p>
      <h2 className="mt-2 font-display text-4xl leading-none text-ink">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function DerivationDisclosure({ figure }: { figure: FigureRow }) {
  return (
    <details className="group border-b border-rule">
      <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-ink marker:content-none">
        {fr.addressSheet.derivation}<span aria-hidden="true" className="font-mono group-open:hidden">+</span><span aria-hidden="true" className="hidden font-mono group-open:inline">−</span>
      </summary>
      <dl className="space-y-2 pb-4 font-mono text-xs leading-5 text-ink-2">
        <div><dt className="inline font-semibold">{fr.addressSheet.calculation} · </dt><dd className="inline">{figure.derivation.formula}</dd></div>
        <div><dt className="inline font-semibold">{fr.addressSheet.radius} · </dt><dd className="inline">{figure.derivation.radiusM} m</dd></div>
        <div><dt className="inline font-semibold">{fr.addressSheet.constants} · </dt><dd className="inline">{entries(figure.derivation.constants)}</dd></div>
        <div><dt className="inline font-semibold">{fr.addressSheet.operands} · </dt><dd className="inline">{entries(figure.derivation.operands)}</dd></div>
      </dl>
    </details>
  );
}

function DataFigure({ figure }: { figure: FigureRow }) {
  if (figure.value === null && "missingReason" in figure) {
    return <div><MissingFigure label={figure.label} scale={figure.scale} reason={figure.missingReason} description={figure.counts} source={figure.source} licence={figure.licence} asOf={figure.asOf} /><DerivationDisclosure figure={figure} /></div>;
  }
  if (figure.value === null) return null;
  return (
    <div>
      <Figure label={figure.label} value={figure.value} scale={figure.scale} description={figure.counts} source={figure.source} licence={figure.licence} asOf={figure.asOf} method={figure.method as FigureMethod} note={"note" in figure ? figure.note : undefined} />
      <DerivationDisclosure figure={figure} />
    </div>
  );
}

function TimelineEvent({ row }: { row: TimelineRow }) {
  if (row.withheld) {
    return (
      <li className="grid gap-3 border-t border-rule py-5">
        <p className="font-mono text-xs text-ink-2">{formatDate(row.occurred_on)} · {row.source}</p>
        <RetenuBlock evidence={row.evidence} />
      </li>
    );
  }
  const isSurvey = row.kind === "survey";
  return (
    <li className="border-t border-rule py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-ink-2">{formatDate(row.occurred_on)} · {isSurvey ? fr.addressSheet.survey : row.kind === "sale" ? fr.addressSheet.sale : fr.addressSheet.proceeding}</p>
          <h3 className="mt-2 font-display text-xl leading-6 text-ink">{row.label ?? fr.addressSheet.unavailable}</h3>
          {row.detail ? <p className="mt-1 text-sm leading-6 text-ink-2">{row.detail}</p> : null}
        </div>
        {row.amount_eur !== null ? <p className="font-display text-2xl text-ink">{formatMoney(row.amount_eur)}</p> : null}
      </div>
      <div className="mt-3"><ConfidenceMark level={row.confidence as Confidence} /></div>
      <p className="text-sm leading-6 text-ink-2">{row.confidence_reason}</p>
      <div className="mt-3"><SourceLine source={row.source} licence={row.source_licence} asOf={row.occurred_on} /></div>
      {row.source_url ? <a className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4" href={row.source_url} target="_blank" rel="noreferrer">{fr.addressSheet.openNotice}<ExternalLink aria-hidden="true" className="size-4" /></a> : null}
    </li>
  );
}

function SignalList({ title, rows }: { title: string; rows: SignalRow[] }) {
  return (
    <div>
      <h3 className="border-b border-ink pb-3 font-display text-2xl text-ink">{title} <span className="font-mono text-xs text-ink-2">({rows.length})</span></h3>
      {rows.length === 0 ? <p className="py-5 text-sm text-ink-2">{fr.addressSheet.noSignals}</p> : (
        <ol>{rows.map((row) => (
          <li key={row.announcement_id} className="border-b border-rule py-5">
            <p className="font-mono text-xs text-ink-2">{formatDate(row.published_on)} · {formatDistance(row.distance_m)}</p>
            <h4 className="mt-2 font-display text-xl leading-6 text-ink">{row.family === "vente" ? row.activity : row.judgment_nature}</h4>
            <p className="mt-2 text-sm leading-6 text-ink-2">{row.address}</p>
            {row.price_eur !== null ? <p className="mt-2 font-display text-2xl text-ink">{formatMoney(row.price_eur)}</p> : null}
            <div className="mt-3 space-y-1 border-l-2 border-rule pl-3 text-xs leading-5 text-ink-2">
              {row.address_source === "siege_social" ? <p>{fr.addressSheet.registeredOffice}</p> : null}
              {row.premises_at_address > 1 ? <p>{fr.addressSheet.sharedAddress}</p> : null}
            </div>
            <a className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4" href={row.url} target="_blank" rel="noreferrer">{fr.addressSheet.openNotice}<ExternalLink aria-hidden="true" className="size-4" /></a>
          </li>
        ))}</ol>
      )}
    </div>
  );
}

export function AddressSheet({ address }: { address: AddressFixture }) {
  const [activeChapter, setActiveChapter] = useState<ChapterId>("verdict");
  const [selectedUnitId, setSelectedUnitId] = useState(address.unitCandidates.preselected);
  const exactCandidates = useMemo(() => address.unitCandidates.rows.filter((candidate) => candidate.address.split(" ")[0] === address.address.housenumber), [address]);
  const bearingFigures = address.dossier.figures.filter((figure) => figure.bearing);
  const surroundingFigures = address.dossier.figures.filter((figure) => !figure.bearing);
  const timeline = [...address.unitTimeline.rows].sort((a, b) => a.occurred_on.localeCompare(b.occurred_on));
  const signals = [...address.nearbySignals.rows].sort((a, b) => b.published_on.localeCompare(a.published_on));
  const vintage2023 = shared.vintages.rows.find((row) => row.vintage_year === 2023);
  const selectedCandidate = address.unitCandidates.rows.find((candidate) => candidate.location_id === selectedUnitId);
  const hasSelectedDossier = selectedUnitId === address.unitCandidates.preselected;

  return (
    <main className="relative min-w-0 bg-ground lg:grid lg:grid-cols-[520px_minmax(0,1fr)] lg:items-start">
      <div className={`sticky top-0 z-10 col-start-2 row-start-1 w-full transition-[height] duration-300 lg:h-screen ${activeChapter === "verdict" ? "h-[290px]" : "h-[58px]"}`}>
        <LeafletAddressMap address={address} view={viewByChapter[activeChapter]} compact={activeChapter !== "verdict"} />
      </div>

      <article className="relative z-20 col-start-1 row-start-1 min-w-0 bg-paper lg:border-r lg:border-ink">
        <header className="px-4 py-10 sm:px-8 sm:py-14">
          <p className="font-mono text-xs text-ink-2">{fr.addressSheet.kicker}</p>
          <h1 className="mt-3 font-display text-4xl leading-[0.95] text-ink sm:text-5xl">{address.address.label}</h1>
          <div className="mt-5"><SourceLine source={address.address.source} licence={address.address.licence} /></div>

          {exactCandidates.length > 1 ? (
            <fieldset className="mt-8 border-t-2 border-ink pt-5">
              <legend className="font-display text-xl text-ink">{fr.addressSheet.shopfrontChoice}</legend>
              <div className="mt-3 divide-y divide-rule border-y border-rule">
                {exactCandidates.map((candidate) => (
                  <label key={candidate.location_id} className="grid min-h-14 cursor-pointer grid-cols-[20px_minmax(0,1fr)] items-center gap-3 py-2 text-sm text-ink-2">
                    <input type="radio" name="unit-candidate" value={candidate.location_id} checked={selectedUnitId === candidate.location_id} onChange={() => setSelectedUnitId(candidate.location_id)} className="size-4 accent-[var(--confidence)]" />
                    <span><strong className="font-semibold text-ink">{candidate.sign_name ?? candidate.activity_label}</strong><br />{candidate.activity_label} · {formatDistance(candidate.distance_m)}</span>
                  </label>
                ))}
              </div>
              {hasSelectedDossier ? <p className="mt-3 font-mono text-xs text-ink-2">{fr.addressSheet.selectedShopfront}</p> : <p className="mt-3 border border-dashed border-ink p-4 text-sm leading-6 text-ink-2">{fr.addressSheet.unavailableShopfront}</p>}
            </fieldset>
          ) : null}
        </header>

        {hasSelectedDossier ? <>
          <Chapter id="verdict" number="01" title={fr.addressSheet.chapters.verdict} onVisible={setActiveChapter}>
            <p className="font-display text-3xl leading-9 text-ink">{address.dossier.verdict.sentence}</p>
            <div className="mt-10 grid gap-10">{bearingFigures.map((figure) => <DataFigure key={figure.axis} figure={figure} />)}</div>
          </Chapter>

          <Chapter id="before" number="02" title={fr.addressSheet.chapters.before} onVisible={setActiveChapter}>
            <h3 className="mb-4 font-display text-2xl text-ink">{fr.addressSheet.timeline}</h3>
            <p className="mb-6 border-l-2 border-ink pl-4 text-sm leading-6 text-ink-2">{fr.addressSheet.bodaccCaveat}</p>
            <ol>{timeline.map((row) => <TimelineEvent key={`${row.occurred_on}-${row.kind}-${row.source_ref}`} row={row} />)}</ol>
          </Chapter>

          <Chapter id="today" number="03" title={fr.addressSheet.chapters.today} onVisible={setActiveChapter}>
            <div className="border-t-2 border-ink pt-4">
              <h3 className="font-display text-2xl text-ink">{fr.addressSheet.unit}</h3>
              <dl className="mt-5 divide-y divide-rule border-y border-rule text-sm">
                {[
                  [fr.addressSheet.activity, address.unit.activity_label],
                  [fr.addressSheet.family, address.unit.activity_group],
                  [fr.addressSheet.sign, address.unit.sign_name],
                  [fr.addressSheet.size, address.unit.size_label],
                  [fr.addressSheet.situation, address.unit.situation_label],
                  [fr.addressSheet.terrace, address.unit.terrasse_permanente || address.unit.terrasse_estivale || address.unit.terrasse_etalage ? fr.addressSheet.yes : fr.addressSheet.no],
                  [fr.addressSheet.protected, address.unit.plu_protected ? fr.addressSheet.yes : fr.addressSheet.no],
                  [fr.addressSheet.station, address.unit.idfm_station_name ? `${address.unit.idfm_station_name} · ${formatDistance(address.unit.idfm_station_distance_m)}` : null],
                  ...(address.unit.chantier_exposed ? [["Chantier signalé", address.unit.chantier_objet ?? address.unit.chantier_description]] : []),
                ].map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-3"><dt className="font-semibold text-ink">{label}</dt><dd className="text-ink-2">{value ?? fr.addressSheet.unavailable}</dd></div>)}
              </dl>
              <p className="mt-3 text-xs leading-5 text-ink-2">{fr.addressSheet.protectedCaveat}</p>
              {vintage2023 ? <div className="mt-4"><SourceLine source="APUR BDCom 2023" licence={vintage2023.licence} asOf={vintage2023.as_of} /></div> : null}
            </div>

            <div className="mt-12 border-t-2 border-ink pt-4">
              <p className="font-mono text-xs text-ink-2">{fr.addressSheet.weekday} · {address.dossier.rythme.shape.dayType}</p>
              <h3 className="mt-2 font-display text-3xl text-ink">{fr.addressSheet.rhythm}</h3>
              <p className="mt-2 text-sm text-ink-2">{address.dossier.rythme.shape.stationName} · {formatDistance(address.dossier.rythme.shape.distanceM)}</p>
              <div className="mt-6 flex h-36 items-end gap-px border-b border-ink" aria-label={address.dossier.rythme.reading}>
                {address.dossier.rythme.shape.buckets.map((bucket) => <div key={bucket.hour} className="min-w-0 flex-1 bg-confidence" style={{ height: `${Math.max(2, bucket.pct / 16 * 100)}%` }} title={`${bucket.label} · ${bucket.pct} %`} />)}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 font-mono text-xs text-ink-2">
                <p>{fr.addressSheet.morning}<br /><strong className="text-ink">{address.dossier.rythme.shape.windows.matin.toFixed(1)} %</strong></p>
                <p>{fr.addressSheet.midday}<br /><strong className="text-ink">{address.dossier.rythme.shape.windows.midi.toFixed(1)} %</strong></p>
                <p>{fr.addressSheet.evening}<br /><strong className="text-ink">{address.dossier.rythme.shape.windows.soir.toFixed(1)} %</strong></p>
              </div>
              <p className="mt-6 font-display text-xl leading-7 text-ink">{address.dossier.rythme.reading}</p>
              <div className="mt-5 border-l-2 border-ink pl-4"><p className="font-mono text-xs font-semibold text-ink-2">{fr.addressSheet.stationCaveat}</p><p className="mt-2 text-sm leading-6 text-ink-2">{address.dossier.rythme.note}</p></div>
              <div className="mt-4"><SourceLine source={address.dossier.rythme.source} licence={address.dossier.rythme.licence} asOf={address.dossier.rythme.asOf} /></div>
            </div>

            <div className="mt-12"><h3 className="mb-4 font-display text-2xl text-ink">{fr.addressSheet.rotation}</h3>{address.streetRotation.rows.map((row, index) => <RetenuBlock key={index} evidence={row.evidence} />)}</div>
          </Chapter>

          <Chapter id="tomorrow" number="04" title={fr.addressSheet.chapters.tomorrow} onVisible={setActiveChapter}>
            <p className="mb-8 font-display text-2xl leading-8 text-ink">{fr.addressSheet.signals}</p>
            <div className="grid gap-12"><SignalList title={fr.addressSheet.sales} rows={signals.filter((row) => row.family === "vente")} /><SignalList title={fr.addressSheet.proceedings} rows={signals.filter((row) => row.family === "collective")} /></div>
          </Chapter>

          <Chapter id="around" number="05" title={fr.addressSheet.chapters.around} onVisible={setActiveChapter}>
            <div className="grid gap-10">{surroundingFigures.map((figure) => <DataFigure key={figure.axis} figure={figure} />)}</div>
            <div className="mt-14"><h3 className="mb-6 font-display text-3xl text-ink">{fr.addressSheet.limits}</h3><div className="grid gap-8">{shared.jamais.rows.map((row) => <JamaisBlock key={row.topic} topic={row.topic} text={row.text} alternative={neverAction(row.topic)} />)}</div></div>
          </Chapter>
        </> : (
          <div className="min-h-[24rem] border-t-2 border-ink px-4 py-10 sm:px-8"><p className="font-display text-2xl leading-8 text-ink">{selectedCandidate?.sign_name ?? selectedCandidate?.activity_label}</p><p className="mt-4 text-sm leading-6 text-ink-2">{fr.addressSheet.unavailableShopfront}</p></div>
        )}
      </article>
    </main>
  );
}