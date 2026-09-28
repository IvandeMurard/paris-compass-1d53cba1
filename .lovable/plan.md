# Compass Phase 1 foundations

## Goal
Create the Compass design foundation and a `/kit` reference page using only the existing fixture. Keep the project’s required TanStack Router rather than adding a second router.

## Changes
- Replace the generic theme with Compass CSS variables and Tailwind tokens for the specified paper, ink, rule, confidence colors, sharp geometry, and typography.
- Load Newsreader, Public Sans, and IBM Plex Mono in the document head.
- Add French copy for all primitive labels and states in `src/copy/fr.ts`.
- Add the six Compass primitives: confidence mark, source line, retained block, unavailable-data guidance, figure, and missing figure.
- Add typed fixture accessors whose types come directly from `compass-fixture.json`; unknown address slugs return `undefined`.
- Add `/kit` as a dedicated route and populate it only with real fixture values, including both retained examples and the null noise measurement.
- Replace placeholder metadata with Compass-specific metadata while leaving `/` without a product screen.

## Validation
- Confirm the app builds without errors.
- Open `/kit` at desktop and mobile widths and check typography, spacing, shapes, and overflow.
- Verify the real retained evidence appears and the missing noise value reads `non mesuré`.
