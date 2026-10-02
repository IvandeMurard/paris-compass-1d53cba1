import { useEffect, useState } from "react";

import { fr } from "@/copy/fr";
import type { AddressFixture } from "@/data/fixture";
import { SourceLine } from "./SourceLine";

const t = fr.pages.visitPage;
const dayOrder = ["JOHV", "JOVS", "SAHV", "SAVS", "DIJFP"] as const;
type DayKey = (typeof dayOrder)[number];
type Slot = { count: number; startedAt: number | null; done: boolean };
const SLOT_MS = 10 * 60 * 1000;
const emptySlots = (): Slot[] => [0, 1, 2].map(() => ({ count: 0, startedAt: null, done: false }));

function Counter({ slug }: { slug: string }) {
  const key = `compass_visit_count_${slug}`;
  const [slots, setSlots] = useState<Slot[]>(emptySlots);
  const [now, setNow] = useState(() => Date.now());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) setSlots(JSON.parse(raw)); } catch { /* ignore */ }
    setReady(true);
  }, [key]);
  useEffect(() => { if (ready) localStorage.setItem(key, JSON.stringify(slots)); }, [key, slots, ready]);
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);

  const update = (i: number, fn: (s: Slot) => Slot) => setSlots((all) => all.map((s, j) => (j === i ? fn(s) : s)));
  const running = (s: Slot) => s.startedAt !== null && !s.done && now - s.startedAt < SLOT_MS;
  useEffect(() => {
    slots.forEach((s, i) => { if (s.startedAt !== null && !s.done && now - s.startedAt >= SLOT_MS) update(i, (x) => ({ ...x, done: true })); });
  }, [now, slots]);

  const remaining = (s: Slot) => {
    const ms = Math.max(0, SLOT_MS - (now - (s.startedAt ?? now)));
    const m = Math.floor(ms / 60000), sec = Math.floor((ms % 60000) / 1000);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };
  const btn = "inline-flex min-h-11 items-center border border-ink px-4 text-sm text-ink disabled:opacity-40";

  return (
    <section className="border-t-2 border-ink px-4 py-10 sm:px-8">
      <h2 className="font-display text-3xl text-ink">{t.counterTitle}</h2>
      <p className="mt-3 text-sm leading-6 text-ink-2">{t.counterLead}</p>
      <ol className="mt-6 divide-y divide-rule border-y border-rule">
        {slots.map((s, i) => (
          <li key={i} className="py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-mono text-xs text-ink-2">{t.slot} {i + 1} · {s.done ? t.done : running(s) ? `${remaining(s)} ${t.remaining}` : "10:00"}</p>
              <p className="font-display text-2xl text-ink">{s.count} <span className="font-mono text-xs text-ink-2">{t.passersBy}</span></p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {running(s)
                ? <><button type="button" className={`${btn} bg-ink text-paper`} onClick={() => update(i, (x) => ({ ...x, count: x.count + 1 }))}>{t.add}</button>
                   <button type="button" className={btn} onClick={() => update(i, (x) => ({ ...x, done: true }))}>{t.stop}</button></>
                : <button type="button" className={btn} disabled={s.done} onClick={() => update(i, () => ({ count: 0, startedAt: Date.now(), done: false }))}>{t.start}</button>}
              <button type="button" className={btn} onClick={() => update(i, () => ({ count: 0, startedAt: null, done: false }))}>{t.reset}</button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function VisitPage({ slug, address }: { slug: string; address: AddressFixture }) {
  const profile = address.stationProfile;
  const [day, setDay] = useState<DayKey>("JOHV");
  const current = profile.dayTypes[day];
  const served = current._tag === "servi";
  const max = Math.max(...current.hours.map((h) => h.pct), 1);
  const rythme = address.dossier.rythme;

  return (
    <main className="w-full max-w-[520px] bg-paper lg:border-r lg:border-ink">
      <header className="px-4 py-10 sm:px-8 sm:py-14">
        <p className="font-mono text-xs text-ink-2">{t.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl leading-[0.95] text-ink sm:text-5xl">{t.title}</h1>
        <p className="mt-4 font-display text-xl text-ink-2">{address.address.label}</p>
        <p className="mt-6 border-l-2 border-ink pl-4 text-sm leading-6 text-ink-2">{t.lead}</p>
      </header>

      <section className="border-t-2 border-ink px-4 py-10 sm:px-8">
        <p className="font-mono text-xs text-ink-2">{t.station} · {profile.station} · {profile.distanceM} m</p>
        <fieldset className="mt-4">
          <legend className="font-display text-xl text-ink">{t.dayTypes}</legend>
          <div className="mt-3 grid grid-cols-1 divide-y divide-rule border-y border-rule">
            {dayOrder.map((key) => {
              const d = profile.dayTypes[key];
              return (
                <label key={key} className="grid min-h-11 cursor-pointer grid-cols-[20px_minmax(0,1fr)] items-center gap-3 py-2 text-sm text-ink">
                  <input type="radio" name="day-type" checked={day === key} onChange={() => setDay(key)} className="size-4 accent-[var(--confidence)]" />
                  <span>{d.label} <span className="font-mono text-xs text-ink-2">{key}{d._tag !== "servi" ? ` · ${t.notYet}` : ""}</span></span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {served ? (
          <div className="mt-8">
            <div className="flex h-36 items-end gap-px border-b border-ink" aria-label={t.departures}>
              {current.hours.map((h) => <div key={h.hour} className="min-w-0 flex-1 bg-confidence" style={{ height: `${Math.max(2, (h.pct / max) * 100)}%` }} title={`${h.hour} · ${h.pct} %`} />)}
            </div>
            <div className="mt-2 flex justify-between font-mono text-xs text-ink-2"><span>0H</span><span>12H</span><span>24H</span></div>
            <p className="mt-4 font-mono text-xs leading-5 text-ink-2">{t.departures}</p>
            <p className="mt-6 font-display text-xl leading-7 text-ink">{rythme.reading}</p>
            <p className="mt-4 border-l-2 border-ink pl-4 text-sm leading-6 text-ink-2">{t.reading}</p>
            <div className="mt-4"><SourceLine source={rythme.source} licence={rythme.licence} asOf={rythme.asOf} /></div>
          </div>
        ) : (
          <div className="mt-8 border border-dashed border-ink p-4">
            <p className="font-mono text-xs text-ink-2">{t.notYet}</p>
            <p className="mt-2 text-sm leading-6 text-ink-2">{t.notYetText}</p>
          </div>
        )}
      </section>

      <Counter slug={slug} />
    </main>
  );
}
