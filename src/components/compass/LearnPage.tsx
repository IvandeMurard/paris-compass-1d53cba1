import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { faq, glossary, guides, learningStages, stageLabels, type LearningStage } from "@/content/apprendre";

const views = [
  ["faq", "Questions"],
  ["glossaire", "Glossaire A–Z"],
  ["guides", "Guides"],
] as const;

export function LearnPage() {
  const [stage, setStage] = useState<LearningStage>("avant");
  const filteredFaq = useMemo(() => faq.filter((entry) => entry.stage === stage), [stage]);
  const filteredGuides = useMemo(() => guides.filter((guide) => guide.stage === stage), [stage]);

  return (
    <main className="bg-paper">
      <header className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-20">
        <p className="font-mono text-xs text-ink-2">Compass · Apprendre</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl leading-none text-ink sm:text-7xl">Apprendre à lire une adresse commerciale</h1>
        <p className="mt-8 max-w-2xl font-display text-2xl leading-8 text-ink-2">Trois moments pour poser les bonnes questions : avant de choisir une rue, devant le local et avant de signer.</p>
        <nav aria-label="Sommaire Apprendre" className="mt-12 grid border-y border-ink sm:grid-cols-3">
          {views.map(([id, label]) => <a key={id} href={`#${id}`} className="flex min-h-14 items-center border-b border-rule px-3 text-sm text-ink transition-colors hover:bg-field sm:border-b-0 sm:border-r sm:last:border-r-0">{label}</a>)}
        </nav>
        <div aria-label="Étape" className="mt-8 grid grid-cols-3 border border-ink">
          {learningStages.map((item) => <Button key={item} type="button" aria-pressed={stage === item} onClick={() => setStage(item)} className={`min-h-11 rounded-none border-0 border-r border-ink px-2 shadow-none last:border-r-0 ${stage === item ? "bg-ink text-document hover:bg-ink" : "bg-paper text-ink hover:bg-field"}`}>{stageLabels[item]}</Button>)}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <section id="faq" className="scroll-mt-6 border-t-2 border-ink py-12 sm:py-16">
          <SectionHeading number="01" title="Questions fréquentes" lead="Compass répond avec les données disponibles et nomme clairement ce qu’aucune source publique ne permet d’affirmer." />
          <div className="mt-10 divide-y divide-rule border-y-2 border-ink">
            {filteredFaq.map((entry) => <article key={entry.question} className="grid gap-5 py-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12"><h3 className="font-display text-2xl leading-7 text-ink">{entry.question}</h3><div><p className="font-display text-xl leading-7 text-ink">{entry.answer}</p>{entry.details ? <p className="mt-4 text-sm leading-6 text-ink-2">{entry.details}</p> : null}</div></article>)}
          </div>
        </section>

        <section id="glossaire" className="scroll-mt-6 border-t-2 border-ink py-12 sm:py-16">
          <SectionHeading number="02" title="Glossaire A–Z" lead="Les mots techniques deviennent utiles lorsqu’ils disent précisément ce qu’une source mesure, publie ou laisse inconnu." />
          <dl className="mt-10 divide-y divide-rule border-y-2 border-ink">
            {glossary.map(([term, definition]) => <div key={term} className="grid gap-3 py-6 sm:grid-cols-[minmax(180px,1fr)_minmax(0,3fr)] sm:gap-8"><dt className="font-display text-2xl text-ink">{term}</dt><dd className="text-sm leading-6 text-ink-2">{definition}</dd></div>)}
          </dl>
        </section>

        <section id="guides" className="scroll-mt-6 border-t-2 border-ink py-12 sm:py-16">
          <SectionHeading number="03" title="Guides" lead="Chaque guide suit un moment de la décision et reste un plan tant que son texte intégral n’est pas écrit." />
          <div className="mt-10 border-y-2 border-ink">
            {filteredGuides.map((guide) => <article key={guide.title} className="py-8"><div className="flex flex-wrap items-baseline justify-between gap-4"><p className="font-mono text-xs text-ink-2">{guide.stage}</p><p className="font-mono text-xs text-ink-2">{guide.duration}</p></div><h3 className="mt-4 max-w-3xl font-display text-4xl leading-none text-ink sm:text-5xl">{guide.title}</h3><p className="mt-6 max-w-3xl font-display text-2xl leading-8 text-ink">{guide.lead}</p><ol className="mt-8 divide-y divide-rule border-t border-ink">{guide.outline.map((item, index) => <li key={item} className="grid grid-cols-[36px_minmax(0,1fr)] gap-3 py-4"><span className="font-mono text-xs text-ink-2">{String(index + 1).padStart(2, "0")}</span><span className="text-sm leading-6 text-ink-2">{item}</span></li>)}</ol></article>)}
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionHeading({ number, title, lead }: { number: string; title: string; lead: string }) {
  return <div className="grid gap-6 lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-12"><div><p className="font-mono text-xs text-ink-2">{number}</p><h2 className="mt-2 font-display text-3xl leading-none text-ink sm:text-4xl">{title}</h2></div><p className="max-w-3xl font-display text-2xl leading-8 text-ink sm:text-3xl sm:leading-10">{lead}</p></div>;
}
