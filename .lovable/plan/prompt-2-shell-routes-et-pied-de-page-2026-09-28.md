# Prompt 2 — Shell, routes et pied de page

## Résultat
- Ajouter une enveloppe commune en français avec l’en-tête Compass, la navigation principale et un pied de page fidèle aux règles visuelles existantes.
- Conserver `/kit` tel qu’il est, désormais présenté dans cette enveloppe commune.
- Créer les pages demandées sans contenu simulé : `/`, `/methode`, `/apprendre`, et les pages d’adresse issues du fichier local.

## Pages et navigation
- `/` : page d’attente française pour l’accueil.
- `/contexte/$slug` : page d’attente liée uniquement à l’adresse réellement trouvée dans le fichier local.
- `/methode` et `/apprendre` : pages d’attente françaises.
- `/contexte/$slug/visite`, `/contexte/$slug/dossier` et `/verifier/demo` : pages Phase 2/3 marquées « à venir ».
- Un slug inconnu affiche seulement « Adresse absente de cette démo » et ne reprend aucune autre adresse.
- Chaque page reçoit son propre titre et sa propre description de partage.

## Pied de page
- Décliner le pied de page en version pleine sur les pages générales, version feuille sur les pages d’adresse, et disposition mobile à 16 px des bords.
- Utiliser des liens internes vers l’accueil, Méthode, Apprendre et le kit, plus « Signaler une erreur » vers les issues GitHub.
- Construire la ligne des sources exclusivement depuis `shared.sourceFreshness`, sans date ou source ajoutée à la main.

## Détails techniques
- Garder TanStack Router, requis par l’application, avec une route parent d’adresse qui rend ses sous-pages.
- Centraliser les nouveaux libellés français dans le fichier de copie et les éléments communs dans de petits composants dédiés.
- Respecter les couleurs, typographies, traits nets, cibles tactiles et absence de cartes/ombres déjà définis.
- Vérifier les pages connues et inconnues, le pied de page pleine largeur et feuille, puis le mobile sans défilement horizontal.
