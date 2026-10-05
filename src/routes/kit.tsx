import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

import {
  ConfidenceMark,
  Figure,
  JamaisBlock,
  MissingFigure,
  RetenuBlock,
  SourceLine,
} from "@/components/compass";
import { fr } from "@/copy/fr";
import { getAddress, shared } from "@/data/fixture";

export const Route = createFileRoute("/kit")({
  head: () => ({
    meta: [
      { title: "Kit d’interface — Compass" },
      { name: "description", content: "Les éléments d’interface de Compass, présentés avec les données réelles du jeu local." },
      { property: "og:title", content: "Kit d’interface — Compass" },
      { property: "og:description", content: "Les éléments d’interface de Compass, présentés avec les données réelles du jeu local." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: KitPage,
});

function KitPage() {
  const batignolles = getAddress("82-place-du-docteur-felix-lobligeois");
  const legendre = getAddress("31-rue-legendre");

  if (!batignolles || !legendre) return null;

  const vintage = shared.vintages.rows.find((row) => row.vintage_year === 2023);
  const timelineRetenu = batignolles.unitTimeline.rows.filter((row) => row.withheld);
  const rotationRetenu = batignolles.streetRotation.rows.filter((row) => row.withheld);
  const density = batignolles.dossier.figures.find((figure) => figure.axis === "density");
  const noise = legendre.dossier.figures.find((figure) => figure.axis === "noise");
  const jamais = shared.jamais.rows[0];
  const jamaisAlternative = jamais?.topic === "Passage piéton"
    ? fr.never.actions["Passage piéton"]
    : fr.never.actions["Loyer commercial"];

  return (
    <main className="min-h-screen bg-ground px-4 py-10 text-ink sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl bg-paper">
        <header className="border-y-2 border-ink px-5 py-7 sm:px-8">
          <p className="font-mono text-xs text-ink-2">COMPASS · PHASE 1</p>
          <h1 className="mt-3 font-display text-5xl leading-none sm:text-7xl">Fondations</h1>
          <p className="mt-4 max-w-2xl font-display text-xl leading-7 text-ink-2">
            Une grammaire visuelle pour dire ce qui est établi, retenu ou absent sans masquer la provenance.
          </p>
        </header>

        <div className="grid lg:grid-cols-[15rem_1fr]">
          <nav aria-label="Sommaire du kit" className="border-b border-ink px-5 py-6 lg:border-r lg:border-b-0 lg:px-8">
            <p className="font-mono text-xs text-ink-2">INDEX</p>
            <ol className="mt-4 space-y-2 font-display text-lg">
              <li>01 · Confiance</li>
              <li>02 · Provenance</li>
              <li>03 · Figures</li>
              <li>04 · Retenu</li>
              <li>05 · Jamais</li>
            </ol>
          </nav>

          <div className="divide-y divide-ink">
            <KitSection number="01" title="Confiance">
              <div className="grid gap-x-8 sm:grid-cols-2">
                <ConfidenceMark level="etabli" />
                <ConfidenceMark level="corrobore" />
                <ConfidenceMark level="probable" />
                <ConfidenceMark level="indetermine" />
              </div>
            </KitSection>

            <KitSection number="02" title="Provenance">
              {vintage ? (
                <SourceLine source="APUR BDCom" licence={vintage.licence} asOf={vintage.as_of} />
              ) : null}
            </KitSection>

            <KitSection number="03" title="Figures">
              <div className="grid gap-12 xl:grid-cols-2">
                {density?.value !== null && density?.value !== undefined && typeof density.derivation.operands.n === "number" ? (
                  <Figure
                    label="Tissu commercial"
                    value={density.derivation.operands.n}
                    scale="locaux à 400 m"
                    source={density.source}
                    licence={density.licence}
                    asOf={density.asOf}
                    method="derived"
                  />
                ) : null}
                {noise?.value === null && noise.missingReason ? (
                  <MissingFigure
                    label={noise.label}
                    scale={noise.scale}
                    reason={noise.missingReason}
                    source={noise.source}
                    licence={noise.licence}
                    asOf={noise.asOf}
                  />
                ) : null}
              </div>
            </KitSection>

            <KitSection number="04" title="Retenu">
              <div className="space-y-5">
                {timelineRetenu.map((row) => (
                  <div key={`${row.source}-${row.occurred_on}`}>
                    <p className="mb-2 font-mono text-xs text-ink-2">{row.source} · licence propre (non lue) · {row.occurred_on.slice(0, 4)}</p>
                    <RetenuBlock evidence={row.evidence} />
                  </div>
                ))}
                {rotationRetenu.map((row, index) => (
                  <div key={`rotation-${index}`}>
                    <p className="mb-2 font-mono text-xs text-ink-2">Rotation de rue · {row.licence}</p>
                    <RetenuBlock evidence={row.evidence} />
                  </div>
                ))}
              </div>
            </KitSection>

            <KitSection number="05" title="Jamais">
              {jamais ? (
                <JamaisBlock
                  topic={jamais.topic}
                  text={jamais.text}
                  alternative={jamaisAlternative}
                />
              ) : null}
            </KitSection>
          </div>
        </div>
      </div>
    </main>
  );
}

function KitSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="px-5 py-9 sm:px-8 sm:py-12">
      <div className="mb-7 flex items-baseline gap-4 border-b border-rule pb-3">
        <span className="font-mono text-xs text-ink-2">{number}</span>
        <h2 className="font-display text-3xl leading-none">{title}</h2>
      </div>
      {children}
    </section>
  );
}