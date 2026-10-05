import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { fr } from "@/copy/fr";
import { addresses, getAddress, type AddressSlug } from "@/data/fixture";
import { HomeSignalMap } from "./HomeSignalMap";

const referenceSlug: AddressSlug = "82-place-du-docteur-felix-lobligeois";
const recentStorageKey = "compass_recent_addresses";
const recentStorageVersionKey = "compass_recent_addresses_version";
const recentStorageVersion = "2";
const visibleGroupCount = 8;

const addressEntries = Object.entries(addresses) as [AddressSlug, (typeof addresses)[AddressSlug]][];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr-FR").trim();
const formatDate = (value: string) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(`${value}T12:00:00`));

type SignalRow = (typeof addresses)[AddressSlug]["nearbySignals"]["rows"][number];
type SignalGroup = { key: string; label: string; rows: SignalRow[]; latest: string };

function sixMonthsAgo() {
  const threshold = new Date();
  threshold.setMonth(threshold.getMonth() - 6);
  return threshold.toISOString().slice(0, 10);
}

function groupSignals(rows: SignalRow[]): SignalGroup[] {
  const grouped = new Map<string, SignalRow[]>();
  rows.filter((row) => row.published_on >= sixMonthsAgo()).forEach((row) => {
    const key = normalize(row.address).replace(/[^a-z0-9]+/g, " ").trim();
    grouped.set(key, [...(grouped.get(key) ?? []), row]);
  });
  return [...grouped.entries()].map(([key, groupRows]) => ({
    key,
    label: groupRows[0]?.address ?? key,
    rows: groupRows.sort((a, b) => b.published_on.localeCompare(a.published_on)),
    latest: groupRows.reduce((latest, row) => row.published_on > latest ? row.published_on : latest, ""),
  })).sort((a, b) => b.latest.localeCompare(a.latest));
}

export function HomePage() {
  const navigate = useNavigate({ from: "/" });
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<AddressSlug | null>(null);
  const [trade, setTrade] = useState("");
  const [recentSlugs, setRecentSlugs] = useState<AddressSlug[]>([]);
  const [showAllGroups, setShowAllGroups] = useState(false);
  const referenceAddress = getAddress(referenceSlug);

  useEffect(() => {
    let next: AddressSlug[] = [];
    const stored = window.localStorage.getItem(recentStorageKey);
    const version = window.localStorage.getItem(recentStorageVersionKey);
    if (stored && version === recentStorageVersion) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((slug): slug is AddressSlug => typeof slug === "string" && getAddress(slug) !== undefined);
          if (valid.length > 0) next = [...new Set(valid)];
        }
      } catch { next = []; }
    }
    window.localStorage.setItem(recentStorageVersionKey, recentStorageVersion);
    window.localStorage.setItem(recentStorageKey, JSON.stringify(next));
    setRecentSlugs(next);
  }, []);

  const matches = useMemo(() => {
    const value = normalize(query);
    if (!value) return [];
    return addressEntries.filter(([, address]) => normalize(address.address.label).includes(value));
  }, [query]);

  const selectedAddress = selectedSlug ? getAddress(selectedSlug) : undefined;
  const signalAddress = getAddress(recentSlugs[0] ?? referenceSlug);
  const signalGroups = useMemo(() => signalAddress ? groupSignals(signalAddress.nearbySignals.rows) : [], [signalAddress]);
  const visibleGroups = showAllGroups ? signalGroups : signalGroups.slice(0, visibleGroupCount);
  const mappedSignals = signalGroups.flatMap((group) => group.rows);

  const chooseAddress = (slug: AddressSlug) => {
    const address = getAddress(slug);
    if (!address) return;
    setQuery(address.address.label);
    setSubmittedQuery(address.address.label);
    setSelectedSlug(slug);
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setSubmittedQuery(query);
    const onlyMatch = matches.length === 1 ? matches[0] : undefined;
    if (onlyMatch) chooseAddress(onlyMatch[0]);
    else setSelectedSlug(null);
  };

  const openSelectedAddress = () => {
    if (!selectedSlug) return;
    const next = [selectedSlug, ...recentSlugs.filter((slug) => slug !== selectedSlug)].slice(0, 3);
    window.localStorage.setItem(recentStorageKey, JSON.stringify(next));
    setRecentSlugs(next);
    void navigate({ to: "/contexte/$slug", params: { slug: selectedSlug } });
  };

  if (!referenceAddress || !signalAddress) return null;

  return (
    <main className="min-w-0 bg-paper text-ink">
      <section className="mx-auto grid max-w-6xl lg:grid-cols-[minmax(0,3fr)_minmax(280px,2fr)]">
        <div className="px-4 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-20 lg:pb-24">
          <p className="font-mono text-xs text-ink-2">{fr.pages.home.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.94] sm:text-7xl lg:text-8xl">{fr.pages.home.title}</h1>

          <form onSubmit={submitSearch} className="mt-10 max-w-3xl border-y-2 border-ink py-5">
            <label htmlFor="home-address" className="font-display text-2xl">{fr.pages.home.searchLabel}</label>
            <div className="mt-4 grid grid-cols-[minmax(0,1fr)_48px] border border-ink bg-document">
              <input id="home-address" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setSubmittedQuery(""); setSelectedSlug(null); }} placeholder={fr.pages.home.searchPlaceholder} autoComplete="off" className="min-h-14 min-w-0 bg-transparent px-4 text-base outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-confidence" />
              <Button type="submit" size="icon" title={fr.pages.home.searchAction} aria-label={fr.pages.home.searchAction} className="h-full w-12 rounded-none border-0 border-l border-ink bg-ink text-document shadow-none hover:bg-ink-2"><Search aria-hidden="true" /></Button>
            </div>

            {query && !selectedSlug && matches.length > 0 ? <ul className="divide-y divide-rule border-x border-b border-ink bg-document">{matches.map(([slug, address]) => <li key={slug}><Button type="button" variant="ghost" onClick={() => chooseAddress(slug)} className="min-h-12 h-auto w-full justify-start whitespace-normal rounded-none px-4 py-3 text-left font-normal shadow-none hover:bg-field">{address.address.label}</Button></li>)}</ul> : null}

            {submittedQuery && !selectedAddress && matches.length === 0 ? <div className="border-x border-b border-ink bg-field p-4"><p className="font-display text-xl">{fr.pages.home.coveredAddresses}</p><ul className="mt-3 divide-y divide-rule border-t border-rule">{addressEntries.map(([slug, address]) => <li key={slug}><Link to="/contexte/$slug" params={{ slug }} className="flex min-h-11 items-center justify-between gap-4 text-sm underline-offset-4 hover:underline"><span>{address.address.label}</span><ArrowRight aria-hidden="true" className="size-4 shrink-0" /></Link></li>)}</ul></div> : null}

            {selectedAddress ? <div className="mt-6 grid gap-4 border-l-2 border-confidence pl-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"><div><label htmlFor="home-trade" className="text-sm font-semibold">{fr.pages.home.tradeLabel}</label><input id="home-trade" value={trade} onChange={(event) => setTrade(event.target.value)} placeholder={fr.pages.home.tradePlaceholder} className="mt-2 min-h-11 w-full border-b border-ink bg-transparent text-sm outline-none placeholder:text-muted focus-visible:border-confidence" /><Button type="button" variant="link" onClick={() => setTrade("")} className="mt-1 min-h-11 rounded-none px-0 text-ink shadow-none">{fr.pages.home.skipTrade}</Button></div><Button type="button" onClick={openSelectedAddress} className="min-h-11 rounded-none bg-ink px-5 text-document shadow-none hover:bg-ink-2">{fr.pages.home.openAddress}<ArrowRight aria-hidden="true" /></Button></div> : null}
          </form>
        </div>

        {recentSlugs.length > 0 ? <aside className="border-t-2 border-ink bg-ground px-4 py-10 sm:px-8 lg:border-l-2 lg:border-t-0 lg:py-20">
          <p className="font-mono text-xs text-ink-2">{fr.pages.home.recentKicker}</p>
          <h2 className="mt-2 font-display text-3xl">{fr.pages.home.recent}</h2>
          <ol className="mt-6 divide-y divide-rule border-y-2 border-ink">{recentSlugs.map((slug, index) => { const address = getAddress(slug); return address ? <li key={slug}><Link to="/contexte/$slug" params={{ slug }} className="grid min-h-16 grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2 py-2 text-sm hover:bg-field"><span className="font-mono text-xs text-ink-2">{String(index + 1).padStart(2, "0")}</span><span>{address.address.label}</span><ArrowRight aria-hidden="true" className="size-4" /></Link></li> : null; })}</ol>
        </aside> : null}
      </section>

      <section className="border-t-2 border-ink bg-ground">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
          <p className="font-mono text-xs text-ink-2">{fr.pages.home.signalsKicker}</p>
          <div className="mt-2 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] lg:items-end"><h2 className="font-display text-4xl leading-none sm:text-6xl">{fr.pages.home.signalsTitle} {signalAddress.address.label}</h2><p className="text-sm leading-6 text-ink-2">{fr.pages.home.signalsIntro}</p></div>
        </div>
        <div className="mx-auto grid max-w-6xl bg-paper lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="max-h-[560px] overflow-y-auto px-4 sm:px-8">
            <ol>{visibleGroups.map((group) => {
              const sales = group.rows.filter((row) => row.family === "vente").length;
              const proceedings = group.rows.length - sales;
              const counts = [sales ? `${sales} ${sales > 1 ? "cessions" : "cession"}` : "", proceedings ? `${proceedings} ${proceedings > 1 ? "procédures collectives" : "procédure collective"}` : ""].filter(Boolean).join(" · ");
              return <li key={group.key} className="border-b border-rule py-5"><details className="group"><summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 marker:content-none"><span><span className="font-display text-xl leading-6">{group.label}</span><span className="mt-2 block font-mono text-xs leading-5 text-ink-2">{counts} · {fr.pages.home.latestOn} {formatDate(group.latest)}</span></span><ChevronDown aria-hidden="true" className="mt-1 size-4 shrink-0 transition-transform group-open:rotate-180" /></summary><ol className="mt-3 border-l border-rule pl-4">{group.rows.map((signal) => <li key={signal.announcement_id} className="border-t border-rule py-3"><p className="font-mono text-xs text-ink-2">{signal.address_source === "siege_social" ? "◇ · " : ""}{formatDate(signal.published_on)}</p><a href={signal.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">{fr.pages.home.openNotice}</a></li>)}</ol></details></li>;
            })}</ol>
            {!showAllGroups && signalGroups.length > visibleGroupCount ? <Button type="button" variant="link" onClick={() => setShowAllGroups(true)} className="min-h-11 rounded-none px-0 text-ink shadow-none">Voir les {signalGroups.length - visibleGroupCount} autres</Button> : null}
          </div>
          <HomeSignalMap address={signalAddress} signals={mappedSignals} />
        </div>
      </section>
    </main>
  );
}