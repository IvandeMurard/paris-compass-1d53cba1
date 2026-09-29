# Prompt 6 — Hub Apprendre

## Résultat

Remplacer le placeholder de `/apprendre` par un hub éditorial français composé de trois vues filtrables : FAQ, glossaire A–Z et guides. Tout le contenu visible proviendra mot pour mot de `docs/HANDOFF-1d.md` §5, sans notes en italique ni marques `✎`.

## Contenu

- Créer `src/content/apprendre.ts` comme source unique du contenu Apprendre, avec des types partagés pour les étapes `avant`, `devant` et `signer`.
- **FAQ (§5.1)** : reprendre les 13 questions, leurs réponses principales et leurs détails ; retirer uniquement les annotations éditoriales en italique, les marques `✎` et le libellé éditorial `Nouvelle —`.
- **Glossaire (§5.2)** : reprendre les 15 entrées et définitions dans l’ordre alphabétique fourni ; retirer uniquement les marques `✎`.
- **Guides (§5.3)** : reprendre les trois titres, durées, phrases d’ouverture et plans numérotés. Omettre les notes en italique ; conserver le libellé d’un point lorsqu’une note italique le suit.
- Ne présenter aucun nombre absent du §5. Les numéros purement structurels de navigation ou de listes ne seront pas traités comme des données produit.

## Page et interactions

- Ajouter un en-tête éditorial et une navigation entre FAQ, Glossaire et Guides.
- Ajouter un filtre d’étape commun `avant / devant / signer`, avec `avant` sélectionné initialement et des commandes accessibles d’au moins 44 px.
- Appliquer le filtre aux questions et aux guides. Le glossaire reste alphabétique et visible quelle que soit l’étape, car le handoff ne lui attribue pas d’étape individuelle.
- Afficher la FAQ avec la question, la réponse principale puis les détails ; présenter les guides comme des plans, sans inventer leur texte intégral.
- Respecter le langage visuel Compass : fond papier, règles franches, coins nets, aucune carte, pilule ou ombre, Newsreader pour les titres et Public Sans pour le corps.

## Métadonnées

- Conserver les métadonnées propres à `/apprendre`.
- Ajouter sur cette page les données structurées `FAQPage` et `HowTo` à partir du même contenu local, sans texte ni chiffre supplémentaire.

## Vérifications

- Comparer le contenu affiché à §5.1–§5.3 et confirmer l’absence de `✎`, de notes en italique et d’ajout numérique.
- Vérifier les trois filtres, les trois sections, les 13 FAQ, les 15 termes et les trois guides.
- Vérifier desktop et mobile, les gouttières de 16 px, l’absence de débordement horizontal et d’erreur navigateur.
- Confirmer la compilation et les métadonnées de la page.
