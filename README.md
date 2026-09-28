# Paris Compass

Compass — design sandbox. Paris commercial-location context from public data.

This project renders screens from ONE local file: src/data/compass-fixture.json. No backend, no fetch, no Supabase, no auth, no API keys. Never invent a figure: every number on screen comes from the fixture, or from docs/HANDOFF-1d.md §5 (content). If data is missing, show it as missing.

Every block carries a tag (see fixture `_tag` and docs/HANDOFF-1d.md §0):
- servi: show with its source · licence · date (IBM Plex Mono line) and its confidence mark.
- retenu: computed but withheld (licence not read). Show the RetenuBlock with the row's `evidence` sentence. Never an empty block, never a placeholder number.
- a-construire: Phase 2 screens only.
- jamais: no open data exists; say what to do instead.

Hard rules:
- The residential rent-control figure concerns housing only: never multiplied by a surface, never called a commercial rent, never a filter.
- No score out of 100 as a headline, no ranking of addresses, no bulk export.
- BODACC names an address, not a unit. `siege_social` = registered office, not necessarily a shop.
- Confidence = shape, never colour alone: établi ● solid · corroboré ● light · probable ○ ring · indéterminé ◌ dashed grey.

Design tokens (literal): paper #f6f3ec · ground #f2efe8 · field #fbf9f4 · document #fffefb · ink #1c1a17 · ink-2 #2e2b26 · muted #4a463f · rule #d9d4c9 · only accent = confidence teal oklch(0.5 0.09 185), light oklch(0.72 0.06 185). Newsreader (headlines, sentences, figures), Public Sans (UI, body), IBM Plex Mono (dates, sources, refs). Sharp corners, 1px/2px ink rules, no cards, no pills, no shadows. Hit targets ≥ 44px, body ≥ 14px, captions ≥ 12px in ink-2.

Map: Leaflet (not MapLibre). UI copy in French, all strings in src/copy/fr.ts.
Stack: React + Vite + TypeScript + Tailwind + react-router.
Don't scaffold any fake data. Wait for src/data/compass-fixture.json to be added.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aa7e07d1-272d-4a76-afbd-08b6c54235d0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
