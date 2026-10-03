# Prompt 10 — Dossier imprimable

## Résultat
- Remplacer l’attente de `/contexte/:slug/dossier` par un document d’étude d’emplacement sobre, sans marque Compass dans le document.
- Utiliser uniquement `addresses[slug].dossier` et `unitTimeline.rows` depuis le fichier local ; ne créer aucun chiffre ni fait.
- Conserver l’état d’adresse absente déjà géré par la route parente.

## Contenu du document
- Couverture : « Étude d’emplacement », adresse, date d’émission issue de `dossier.issuedAt` et source de l’adresse.
- Synthèse : phrase `dossier.verdict.sentence`, puis constats de `dossier.figures` avec valeur ou « non mesuré », méthode, source, licence et date.
- Histoire publiée : `unitTimeline.rows` dans l’ordre chronologique ; prix et niveaux de confiance pour les lignes servies ; composant retenu et phrase `evidence` pour chaque ligne retenue.
- Rythme : lecture, profil horaire JOHV, note de prudence et provenance depuis `dossier.rythme`.
- Limites : chaque élément de `dossier.gaps` avec sa raison exacte ; section absente lorsqu’il n’y a aucun élément.
- Méthode et cadre : textes exacts de `dossier.reproduce.methodology` et `dossier.doctrine`.
- Ne montrer ni numéro de référence, ni QR code, ni zone de signature.

## Présentation et impression
- Composer un document blanc au format A4, hiérarchie éditoriale neutre, règles fines et mise en page lisible sur écran comme sur papier.
- Ajouter une commande d’impression hors document ; elle ne figurera pas sur la feuille imprimée.
- En `@media print`, masquer navigation, pied de page et commandes, retirer les fonds de page inutiles, préserver les couleurs utiles et éviter les coupures dans les constats, sources et blocs retenus.
- Le document imprimé reste sans marque Compass ; les libellés nécessaires sont centralisés dans la copie française.

## Contrôles
- Vérifier les quatre adresses, notamment les lignes retenues 2017/2020 et le bruit « non mesuré » rue Legendre.
- Vérifier l’aperçu A4, l’absence des éléments interdits, la lisibilité mobile et l’absence de débordement horizontal.
- Confirmer la compilation et les erreurs d’exécution avant livraison.
