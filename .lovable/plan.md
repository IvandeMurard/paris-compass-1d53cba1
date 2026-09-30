# Prompt 7 — Accueil Compass

## Résultat
- Remplacer la page d’attente `/` par l’accueil Compass en français, adapté à la première visite, au retour et au mobile.
- Garder le fichier local comme unique source pour les quatre adresses et les signaux BODACC.

## Expérience
- Afficher d’abord la phrase « Avant de signer un bail, lisez la rue. » et une recherche par libellé exact ou partiel parmi les quatre adresses.
- Proposer le métier dans la continuité de la recherche, avec l’option « Juste regarder » ; le choix reste facultatif et ne modifie aucun chiffre.
- Pour une recherche sans correspondance, afficher « Voir les quatre adresses » et les quatre liens réels, sans géocodage ni suggestion extérieure.
- Mémoriser localement les adresses consultées et amorcer les récents avec Lobligeois, rue des Moines et rue Legendre pour l’état de retour.

## Signaux et carte
- Construire le fil depuis `addresses["82-place-du-docteur-felix-lobligeois"].nearbySignals.rows`, trié du plus récent au plus ancien.
- Afficher famille, date, distance et adresse, avec l’avertissement siège social lorsque `address_source` vaut `siege_social`.
- Montrer sur la carte uniquement les signaux dotés d’un `mapPoint`; ne jamais géocoder les autres et ne lire aucun signal Sirene.

## Technique et contrôle
- Ajouter un composant d’accueil dédié et une carte Leaflet chargée uniquement côté navigateur, en conservant la navigation et le pied de page existants.
- Centraliser les nouveaux libellés dans la copie française et utiliser les composants de contrôle existants.
- Vérifier recherche trouvée/inconnue, choix facultatif du métier, récents persistants, ordre du fil, carte, et absence de débordement sur mobile.
