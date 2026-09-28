# Prompt 3 — Fiche adresse `/contexte/:slug`

## Résultat visé

Remplacer uniquement le placeholder de `/contexte/:slug` par une fiche française fondée sur `addresses[slug]`, sans backend ni donnée ajoutée. La page gardera le shell commun et le comportement existant pour un slug inconnu.

Sur grand écran, un document papier de **520 px** défile à gauche d’une carte Leaflet plein cadre. Sur mobile, la carte forme un bandeau de **290 px**, puis une bande de **58 px** pendant la lecture. L’histoire du local, le rythme et les signaux auront davantage d’espace que la phrase de verdict.

## Arbre de composants

```text
ContextPage
└── AddressSheet
    ├── AddressMapPanel
    │   ├── LeafletAddressMap (chargé côté navigateur)
    │   └── MapLegend
    └── AddressDocument (520 px desktop)
        ├── AddressSheetHeader
        │   ├── SourceLine
        │   └── UnitCandidateChoice
        ├── VerdictChapter
        │   ├── VerdictSentence
        │   └── BearingFigure × 4
        │       └── DerivationDisclosure
        ├── BeforeChapter
        │   └── UnitTimeline
        │       ├── SurveyEvent
        │       ├── RetenuBlock
        │       └── BodaccEvent + ConfidenceMark
        ├── TodayChapter
        │   ├── UnitProfile
        │   ├── RhythmProfile
        │   └── RetenuBlock
        ├── TomorrowChapter
        │   └── NearbySignalList
        └── AroundChapter
            ├── Figure | MissingFigure
            └── JamaisBlock
```

`AddressSheet` pilotera le chapitre actif et transmettra à la carte la vue Leaflet correspondante. Les composants de chapitre resteront textuels et utilisables sans carte.

## Champs et tags par chapitre

### En-tête — `servi`

- Adresse : `address.label`, `housenumber`, `street`, `postcode`, `district`, `lat`, `lng`.
- Provenance : `address.source` et `address.licence` dans `SourceLine`.
- **Correction de donnée manquante :** `address` ne contient aucune date de source. `capturedAt` date la capture du fixture, pas la BAN ; il ne sera pas présenté comme date BAN. La ligne indiquera explicitement que la date n’est pas fournie.
- Choix de vitrine : `unitCandidates.preselected` et `unitCandidates.rows[].{location_id,address,activity_label,sign_name,distance_m}`.
- Le choix n’apparaît que lorsque plusieurs lignes correspondent réellement au `address.housenumber`. C’est le cas de `14-rue-des-moines`; les autres entrées proches ne seront pas présentées comme partageant ce numéro.
- La ligne dont `location_id === preselected` sera visiblement sélectionnée. Le fixture ne fournit qu’un `unit`, un `unitTimeline` et un `dossier` complets par slug : les autres candidats seront montrés pour lever l’ambiguïté, mais ne recevront jamais silencieusement le dossier du candidat présélectionné.

### Verdict — `servi`

- Phrase : `dossier.verdict.sentence`.
- Axes retenus : `dossier.verdict.used`.
- Quatre figures : filtrer `dossier.figures` par `bearing === true`, puis utiliser `axis`, `label`, `counts`, `value`, `scale`, `source`, `licence`, `asOf`, `method` et `note` si présente.
- « D’où vient ce chiffre » ouvre la dérivation réelle : `derivation.kind`, `formula`, `radiusM`, `constants` et `operands`.
- Aucun score global, classement ou badge de confiance ne sera ajouté. Les figures n’ont pas de champ `confidence`; `method` ne sera pas transformé artificiellement en niveau de confiance.

### Avant — `servi + retenu`

- Source unique : `unitTimeline.rows`, triée par `occurred_on` croissant.
- Relevé 2023 — `servi` : ligne `kind === "survey" && withheld === false`; afficher `occurred_on`, `label`, `detail`, `source`, `source_licence`, `confidence` et `confidence_reason`.
- Relevés 2017/2020 — `retenu` : lignes `kind === "survey" && withheld === true`; chacune devient un `RetenuBlock` alimenté uniquement par `evidence`, avec la date et la source en contexte.
- Cessions et procédures — `servi` : lignes `kind === "sale" || kind === "proceeding"`; afficher `occurred_on`, `label`, `detail`, `amount_eur` lorsqu’il n’est pas nul, `source`, `source_licence`, `source_url`, puis `ConfidenceMark(confidence)` et `confidence_reason`.
- Le texte rappellera la règle documentée : le BODACC nomme une adresse, pas nécessairement ce local.

### Aujourd’hui — `servi + retenu`

- Local — `servi` : `unit.activity_label`, `activity_group`, `sign_name`, `size_label`, `situation_label`, `is_vacant`, données terrasse `terrasse_*`, protection `plu_*`, chantier `chantier_*`, station `idfm_station_name` / `idfm_station_distance_m`, et coordonnées `lat` / `lng`. Les valeurs nulles sont omises ou signalées comme manquantes, jamais converties en zéro.
- Provenance du relevé : joindre la ligne 2023 de `shared.vintages.rows` pour `licence` et `as_of`, avec la source « APUR BDCom 2023 » déjà présente dans le fixture.
- Rythme — `servi`, exclusivement `dossier.rythme` : `shape.stationName`, `shape.distanceM`, `shape.dayType`, `shape.buckets`, `shape.windows`, `shape.kind`, `scale`, `reading`, `note`, `settles`, `source`, `licence`, `asOf`, `method`. Une visualisation horaire donnera de la place aux 24 valeurs ; `reading` et la note disant qu’une station n’est pas la rue resteront adjacentes.
- Aucun autre profil de `stationProfile.dayTypes` ne sera lu : JOVS, SAHV, SAVS et DIJFP sont `a-construire`.
- Rotation — `retenu` : `streetRotation.rows[0].evidence` dans `RetenuBlock`; aucun taux, changement ou comparaison ne sera déduit des champs nuls.

### Demain — `servi`

- Signaux : `nearbySignals.rows`, séparés par `family` (`vente` / `collective`) et ordonnés par `published_on` décroissant.
- Par ligne : `published_on`, `trader_name`, `activity`, `judgment_nature`, `price_eur` si présent, `address`, `distance_m`, `address_source`, `premises_at_address`, `url` et `mapPoint`.
- Caveats obligatoires : `address_source === "siege_social"` signifie siège social, pas nécessairement boutique ; `premises_at_address > 1` indique plusieurs locaux possibles à l’adresse.
- **Correction de portée :** le fixture décrit ces signaux comme situés dans **400 m** et ne fournit ni découpage 300/800 m ni champ `confidence`. Aucun rayon 300/800 et aucun `ConfidenceMark` ne seront inventés pour eux.
- Le linéaire PLU complet n’est pas ajouté dans ce chapitre : le fixture ne contient que des booléens par local (`unit.plu_*`, `premises400m.rows[].plu`), aucune géométrie de tronçon.

### Autour — `servi + jamais`

- Figures non porteuses : filtrer `dossier.figures` par `bearing === false`, actuellement `alimentaire` et `noise`; utiliser les mêmes champs de provenance et de dérivation que les figures du verdict.
- Si `value === null`, rendre `MissingFigure` avec `missingReason`, jamais `0`. Cela couvre notamment le bruit de `31-rue-legendre` et `44-rue-de-bretagne`.
- Limites — `jamais` : chaque ligne de `shared.jamais.rows` alimente `JamaisBlock(topic, text)`; l’action correspondante vient du contenu français déjà défini depuis le handoff §5.
- Le passage estimé reste distinct du comptage piéton inexistant : `dossier.figures[axis="footfall"]` est une approximation, tandis que `shared.jamais` dit qu’aucun comptage ouvert n’existe.
- **Corrections de contenu :** aucune figure d’air, de risques à 1 km ou d’encadrement résidentiel n’existe dans le fixture. Elles ne seront pas affichées. Le loyer reste un bloc `jamais`; aucun montant résidentiel ne sera transformé en loyer commercial ni multiplié par une surface.

## Carte Leaflet et synchronisation

- Ajouter Leaflet avec un composant chargé uniquement dans le navigateur pour préserver le rendu serveur.
- Couches :
  - `premises400m.rows[].{lat,lng,label,sign,group,d,plu}` en **□** ; tous identiques, car `streetRotation` est retenu ;
  - `unit.{lat,lng}` en **●** ;
  - `nearbySignals.rows[].mapPoint` en **◆**, seulement lorsque `mapPoint` existe ; les signaux sans point restent dans la liste et ne seront jamais géocodés par supposition.
- Chaque point cartographié garde son équivalent textuel dans Avant, Aujourd’hui ou Demain.
- Synchronisation au défilement avec `IntersectionObserver` et `map.flyTo` : local vers zoom ~17, contexte de tronçon centré sur le local vers 16 faute de géométrie de tronçon, contexte proche vers 15.7, contexte large vers 14.8. Ces vues règlent le cadrage seulement et ne prétendent pas fournir des couches 300/800 m absentes.
- Desktop : document gauche de 520 px, carte plein cadre derrière/à droite, sans carte décorative ni ombre.
- Mobile : bandeau de 290 px au début, réduit à 58 px après entrée dans les chapitres ; retour à 290 px en remontant. Les contrôles restent ≥ 44 px et le contenu conserve 16 px de gouttière.
- **Contrainte actuelle :** le projet interdit les clés API et Leaflet n’est pas encore installé. Le plan n’hotlinkera pas les tuiles OSM interdites en production. Sans clé de fournisseur licencié, la première version montrera les couches réelles sur un fond cartographique neutre tokenisé ; l’intégration des tuiles restera isolée et pourra recevoir plus tard une clé publique restreinte sans changer les chapitres.

## Fichiers concernés lors de la construction

- Remplacer le placeholder dans `src/routes/contexte.$slug.index.tsx`.
- Ajouter les composants de fiche et de carte sous `src/components/compass/`, puis les exporter depuis leur index.
- Étendre `src/copy/fr.ts` pour toute nouvelle chaîne visible.
- Adapter les primitives existantes uniquement pour accepter les cas réels nécessaires : date de source manquante, dérivation dépliable et données manquantes.
- Ajouter les styles cartographiques globaux et les tokens nécessaires dans `src/styles.css` sans changer la palette.
- Ajouter les dépendances Leaflet et leurs types ; conserver TanStack Router et `src/data/fixture.ts` comme accès unique aux données.
- Documenter la frontière de chargement Leaflet côté navigateur dans `AGENTS.md`.

## Vérifications

- Tester les quatre slugs réels et conserver « Adresse absente de cette démo » pour un slug inconnu.
- Vérifier `14-rue-des-moines` : les deux vitrines du numéro 14 sont visibles et `49501` est sélectionnée ; aucune vitrine voisine n’est présentée comme partageant le numéro.
- Vérifier chaque chapitre contre son chemin de fixture, les quatre dérivations, l’ordre des dates, les preuves retenues exactes et les prix BODACC seulement lorsqu’ils existent.
- Vérifier `31-rue-legendre` et `44-rue-de-bretagne` : bruit = « non mesuré » avec la raison réelle.
- Vérifier qu’aucun profil autre que JOHV, aucune confiance de figure/signal, aucun chiffre air/risques/loyer, aucun rayon 300/800 et aucun changement de local ne sont inventés.
- Vérifier la carte et les `flyTo` au clavier et au défilement, puis les dimensions 520/290/58 px, les gouttières mobiles de 16 px et l’absence de défilement horizontal.
- Vérifier enfin le rendu desktop/mobile, la console, le typage et le dernier état de compilation.
