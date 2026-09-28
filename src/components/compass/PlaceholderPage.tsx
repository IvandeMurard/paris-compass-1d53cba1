type PlaceholderPageProps = { eyebrow: string; title: string; text: string; address?: string; sheet?: boolean };

export function PlaceholderPage({ eyebrow, title, text, address, sheet = false }: PlaceholderPageProps) {
  return (
    <main className={sheet ? "min-h-[32rem] w-full max-w-[520px] bg-paper px-4 py-12 sm:px-8 sm:py-16 lg:border-r lg:border-ink" : "mx-auto min-h-[32rem] max-w-6xl bg-paper px-4 py-12 sm:px-8 sm:py-16"}>
      <p className="font-mono text-xs uppercase text-ink-2">{eyebrow}</p>
      <h1 className="mt-5 max-w-3xl font-display text-4xl leading-none sm:text-6xl">{title}</h1>
      {address ? <p className="mt-5 max-w-2xl font-display text-2xl leading-8 text-ink-2">{address}</p> : null}
      <p className="mt-8 max-w-2xl border-t border-ink pt-5 text-sm leading-6 text-ink-2">{text}</p>
    </main>
  );
}