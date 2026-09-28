# Prompt 5 — Hub Méthode

## Résultat visé

Remplacer le placeholder de `/methode` par une page française de référence, sans backend ni donnée inventée. Elle conservera le shell commun et présentera six sections navigables : `#principes`, `#formules`, `#sources`, `#fiabilite`, `#retenu` et `#avancement`.

Chaque section commencera par une phrase autonome et citable de 30 mots maximum.

## Structure

```text
MethodPage
├── MethodHeader
│   └── SectionNavigation
├── PrinciplesSection
├── FormulasSection
│   └── FormulaEntry × 6
│       ├── formule
│       ├── rayon
│       ├── constantes
│       └── exemple calculé à l’adresse de référence
├── SourcesSection
│   └── SourceEntry × shared.sourceFreshness.rows
├── ReliabilitySection
│   └── ReliabilityEntry × 4
├── RetainedSection
│   └── VintageEntry × 2
└── ProgressSection
```

## Contenu et provenance

- **Principes — `#principes`** : expliquer les règles éditoriales déjà établies : axes séparés plutôt qu’un score global, provenance visible, distinction entre mesuré/dérivé/estimé/modélisé, donnée manquante dite comme telle, et limites d’un rattachement BODACC à une adresse.
- **Formules — `#formules`** : lire les six lignes de `addresses["82-place-du-docteur-felix-lobligeois"].dossier.figures`. Pour chacune, afficher `label`, `derivation.formula`, `derivation.radiusM`, chaque paire de `derivation.constants` et chaque paire de `derivation.operands`. Les nombres seront convertis en texte sans arrondi ni recalcul. L’adresse de référence sera nommée comme exemple, et aucune valeur finale supplémentaire ne sera dérivée.
- **Sources — `#sources`** : une ligne par `shared.sourceFreshness.rows`, avec exactement `label`, `cadence`, `cadence_note` et `source_as_of`.
- **Fiabilité — `#fiabilite`** : les quatre formes de `ConfidenceMark` avec les définitions du handoff §5.2 : établi = la source nomme le local ; corroboré = deux sources concordent ; probable = rattachement au local déduit ; indéterminé = source muette.
- **Ce qui est retenu — `#retenu`** : filtrer `shared.vintages.rows` sur 2017 et 2020. La phrase d’ouverture expliquera que ces données sont calculées mais non montrées tant que leur licence n’est pas lue. Chaque millésime affichera `vintage_year`, `licence`, `as_of` et le texte exact de `licence_note`, sans traduction ni reformulation de ce champ.
- **Avancement — `#avancement`** : conserver uniquement l’état « à venir » demandé, précédé d’une phrase citable.

## Présentation

- Document éditorial plein format, fond papier, typographies et couleurs Compass existantes.
- Sommaire à ancres avec cibles tactiles d’au moins 44 px.
- Sections séparées par des règles franches, sans cartes, ombres ni pastilles décoratives.
- Formules, constantes, opérandes, dates et identifiants en IBM Plex Mono ; titres et phrases d’ouverture en Newsreader.
- Mise en page dense mais lisible : colonne de lecture principale et repères latéraux sur grand écran, une seule colonne avec gouttières de 16 px sur mobile.

## Fichiers concernés

- Remplacer le placeholder dans `src/routes/methode.tsx`.
- Ajouter les chaînes visibles nécessaires dans `src/copy/fr.ts`.
- Ajouter un composant Méthode sous `src/components/compass/` et l’exporter depuis son index.
- Conserver `src/data/fixture.ts` comme unique accès aux données.

## Vérifications

- Vérifier les six ancres et les six phrases d’ouverture, chacune ≤ 30 mots.
- Comparer les six formules, rayons, constantes et opérandes caractère par caractère aux valeurs du fixture, notamment les décimales non arrondies.
- Vérifier que toutes les lignes `sourceFreshness` apparaissent avec les quatre champs demandés.
- Vérifier les quatre formes et définitions de fiabilité.
- Vérifier que seuls les millésimes 2017 et 2020 apparaissent dans la section retenue, avec `licence = custom` et leur `licence_note` exact.
- Vérifier « à venir », les métadonnées de page, le rendu desktop/mobile, l’absence de débordement horizontal, les erreurs navigateur et la compilation.
