export const fr = {
  shell: {
    brand: "Compass",
    home: "Accueil",
    method: "Méthode",
    learn: "Apprendre",
    kit: "Kit",
    navigation: "Navigation principale",
    footerNavigation: "Navigation du pied de page",
    sources: "Sources",
    sourceDate: "données au",
    reportIssue: "Signaler une erreur",
    footerStatement: "Lire le contexte d’une adresse commerciale parisienne à partir de données publiques.",
  },
  pages: {
    home: { eyebrow: "Compass · Paris", title: "Avant de signer un bail, lisez la rue.", text: "L’accueil complet arrive dans la prochaine étape de cette démo." },
    method: { eyebrow: "Compass · Méthode", title: "Comment Compass lit-il un emplacement ?", text: "Les principes, les formules, les sources et leur fiabilité seront présentés ici." },
    learn: { eyebrow: "Compass · Apprendre", title: "Apprendre à lire une adresse commerciale", text: "Les guides, les questions fréquentes et le glossaire seront présentés ici." },
    context: { eyebrow: "Compass · Contexte", title: "Contexte de l’adresse", text: "La lecture complète de cette adresse sera présentée ici.", absent: "Adresse absente de cette démo" },
    visit: { eyebrow: "Compass · Phase 2", title: "Préparer la visite", text: "à venir" },
    dossier: { eyebrow: "Compass · Phase 2", title: "Dossier de l’adresse", text: "à venir" },
    verify: { eyebrow: "Compass · Phase 3", title: "Vérifier un dossier", text: "à venir" },
  },
  confidence: {
    etabli: "Confiance : établi",
    corrobore: "Confiance : corroboré",
    probable: "Confiance : probable",
    indetermine: "Confiance : indéterminé",
  },
  retained: {
    label: "retenu — licence",
  },
  never: {
    label: "aucune donnée ouverte",
    action: "À faire à la place",
    actions: {
      "Loyer commercial": "Demandez le loyer, les charges et les conditions du bail au bailleur.",
      "Passage piéton": "Comptez vous-même les passants à plusieurs heures et plusieurs jours.",
    },
  },
  figure: {
    methods: {
      measured: "mesuré",
      derived: "dérivé",
      estimated: "estimé",
      modelled: "modélisé",
    },
    missing: "non mesuré",
  },
} as const;