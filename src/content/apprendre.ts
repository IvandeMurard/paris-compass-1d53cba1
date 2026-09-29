export const learningStages = ["avant", "devant", "signer"] as const;
export type LearningStage = (typeof learningStages)[number];

export const stageLabels: Record<LearningStage, string> = {
  avant: "avant",
  devant: "devant",
  signer: "signer",
};

export type FaqEntry = {
  stage: LearningStage;
  question: string;
  answer: string;
  details?: string;
};

export const faq: readonly FaqEntry[] = [
  { stage: "avant", question: "Qu'est-ce que Compass ?", answer: "Un outil gratuit qui lit le contexte d'une adresse commerciale à Paris — ce qui était là, ce qui change, ce que ça coûte — à partir de données publiques.", details: "Chaque chiffre cite sa source, sa licence, sa date et son niveau de fiabilité. Sans compte. Paris intra-muros." },
  { stage: "avant", question: "Compass liste-t-il des locaux à louer ?", answer: "Non. Compass montre ce qui se publie avant toute annonce : cessions de fonds et procédures collectives, au BODACC.", details: "Les annonces vivent sur des portails privés dont les conditions interdisent la reprise. Le BODACC nomme une adresse, pas un local. Une absence de signal ne veut pas dire « rien à saisir »." },
  { stage: "avant", question: "Pourquoi Compass n'estime-t-il pas le loyer ?", answer: "Parce qu'aucune donnée publique de loyers commerciaux n'existe en France.", details: "L'encadrement des loyers publié par la Ville ne concerne que le logement. L'ILC est un indice de révision, pas un niveau. Le prix des fonds (BODACC) porte un signal indirect, rien de plus." },
  { stage: "avant", question: "Pourquoi pas une note sur 100 ?", answer: "Parce qu'une boulangerie veut du passage, un studio de yoga du calme : une note unique ferait la moyenne de ce qui s'oppose.", details: "Compass affiche les axes séparément et laisse votre métier fixer l'ordre de lecture." },
  { stage: "avant", question: "D'où viennent les données ?", answer: "De registres publics : recensement des commerces de l'APUR, BODACC, Sirene, profils horaires IDFM, OpenStreetMap, Copernicus, Géorisques.", details: "Le détail, source par source, avec sa licence et son état, est dans Méthode › Sources." },
  { stage: "avant", question: "Pourquoi certaines informations sont-elles « retenues » ?", answer: "Parce que Compass les a calculées mais n'a pas encore le droit de les montrer : la licence des relevés APUR 2017 et 2020 n'a pas été lue.", details: "La question est posée à l'APUR. Tant qu'elle est sans réponse, seul le relevé 2023 est public : l'histoire d'un local avant 2023, la rotation d'une rue et la survie d'un métier restent retenues. Compass le dit plutôt que de le taire." },
  { stage: "devant", question: "Comment savoir si une cuisine a déjà existé dans un local ?", answer: "Regardez l'activité recensée en 2023 et les cessions publiées à l'adresse : un fonds de restauration cédé là est un indice fort.", details: "Vérifiez la gaine sur place : la créer coûte des dizaines de milliers d'euros et demande l'accord de la copropriété. Les relevés 2017 et 2020 sont retenus." },
  { stage: "devant", question: "Cette rue est-elle un cimetière ou une bonne rue ?", answer: "Compass compare les vitrines d'un relevé à l'autre ; cette comparaison est retenue tant que la licence des relevés anciens n'est pas lue.", details: "En attendant, lisez ce qui se publie autour — procédures collectives et cessions — et comptez les vitrines fermées en visite." },
  { stage: "devant", question: "À quelle heure visiter un local ?", answer: "Aux heures où votre clientèle passe — Compass les déduit du profil horaire de la station la plus proche, un jour ouvré hors vacances.", details: "Une station compte les départs : matinale = quartier d'habitation, vespérale = bureaux ou destination. Vacances, samedi et dimanche : à venir." },
  { stage: "devant", question: "Combien de piétons passent devant la vitrine ?", answer: "Aucune donnée ouverte ne le dit : Paris n'a pas de capteur piéton permanent.", details: "Les chiffres vendus viennent de panels de téléphones, modélisés et invérifiables. Compass vous dit quand vous poster, et vous pouvez compter vous-même." },
  { stage: "signer", question: "Combien coûte un fonds de commerce à Paris ?", answer: "La médiane des cessions publiées au BODACC se situe entre 160 000 et 170 000 € ; autour de 220 000 € pour un café-restaurant.", details: "Une fourchette, pas un prix : les montants sont déclarés en chiffres ronds et le métier pèse plus que la rue." },
  { stage: "signer", question: "Qu'est-ce qu'un linéaire commercial protégé ?", answer: "Un tronçon où le PLU interdit de transformer un rez-de-chaussée commercial en autre chose.", details: "Indication seulement : le Portail des règles d'urbanisme de la Ville fait foi." },
  { stage: "signer", question: "Que contient le dossier que je peux envoyer à mon banquier ?", answer: "Une étude d'emplacement à votre nom : synthèse, constats sourcés, limites, et vos observations de visite si vous les joignez." },
];

export const glossary = [
  ["BDCom", "Recensement porte-à-porte de tous les rez-de-chaussée commerciaux parisiens par l'APUR (2017, 2020, 2023). Un même local garde son identifiant d'un relevé à l'autre. Seul le relevé 2023 est public dans Compass aujourd'hui."],
  ["BODACC", "Bulletin officiel où sont publiées les ventes de fonds (avec leur prix) et les procédures collectives. Il nomme une adresse, pas un local."],
  ["Bail 3/6/9", "Bail commercial de neuf ans, résiliable par le locataire tous les trois ans."],
  ["Cession de fonds", "Vente du fonds de commerce : clientèle, droit au bail, matériel. Publiée au BODACC."],
  ["Établi / corroboré / probable / indéterminé", "Les quatre niveaux de fiabilité d'un fait : la source nomme le local · deux sources concordent · le rattachement au local est déduit · la source est muette."],
  ["Gaine d'extraction", "Conduit qui évacue fumées et odeurs de cuisson jusqu'au toit. Sa présence change le coût d'un projet de restauration."],
  ["ILC", "Indice des loyers commerciaux (INSEE). Sert à réviser un loyer existant, jamais à le fixer."],
  ["Linéaire protégé", "Tronçon de rue où le PLU interdit le changement de destination d'un commerce en rez-de-chaussée."],
  ["Mesuré / modélisé / estimé", "Compté ou relevé · produit par un modèle publié (ex. air) · approximation faute de donnée ouverte, toujours signalée."],
  ["ODbL", "Licence libre d'OpenStreetMap et de BDCom 2023 : citer la source et partager à l'identique."],
  ["Procédure collective", "Sauvegarde, redressement ou liquidation judiciaire. Publiée au BODACC, souvent des mois avant qu'un local soit proposé."],
  ["Retenu", "Calculé par Compass, mais pas montré : la licence de la source n'a pas été lue. Différent de « absent », où la donnée n'existe pas."],
  ["Rotation", "Part des vitrines d'un tronçon qui ont changé d'activité entre deux recensements, lue contre celle du quartier."],
  ["Tronçon", "Portion de rue entre deux intersections : l'échelle à laquelle Compass compare."],
  ["Validation", "Passage de carte à l'entrée d'une station. Le réseau parisien n'en a pas à la sortie : un profil horaire décrit les départs."],
] as const;

export type Guide = { stage: LearningStage; title: string; duration: string; lead: string; outline: readonly string[] };
export const guides: readonly Guide[] = [
  { stage: "avant", title: "Choisir un quartier pour son métier", duration: "6 min", lead: "Un même local ne vaut pas la même chose pour une boulangerie et pour un bar à vin : lisez d'abord le rythme du quartier.", outline: ["Matinal ou vespéral — lire le profil de la station la plus proche (départs, pas arrivées).", "La semaine et les vacances", "Votre métier ici aujourd'hui — ce que le relevé 2023 compte autour ; la survie par quartier est retenue, et le guide dit pourquoi.", "Ce qui arrive — procédures et cessions publiées autour.", "Ce qu'aucune donnée ne dira — loyer, passage, dépenses."] },
  { stage: "devant", title: "Visiter un local : les points à trancher", duration: "8 min", lead: "La visite doit répondre à ce qu'aucune donnée publique ne dit ; Compass vous dit quoi regarder et quand venir.", outline: ["Les vies du local — l'activité de 2023, les cessions à l'adresse ; cuisine, extraction, arrivée électrique à vérifier sur place.", "La vitrine exacte — quand plusieurs partagent un numéro.", "Le trottoir — largeur, terrasse, livraisons, arrêt de bus.", "Les heures — venir aux pics de votre clientèle, pas aux creux.", "Compter soi-même — 10 minutes, trois créneaux, relevé à votre nom.", "Les questions au bailleur — loyer, destination du bail, copropriété, travaux."] },
  { stage: "signer", title: "Racheter un fonds : lire un prix publié", duration: "7 min", lead: "Les cessions de fonds sont publiques et chiffrées ; une médiane de quartier situe une négociation, elle n'estime pas un prix.", outline: ["Où trouver les prix — BODACC, cession par cession.", "Lire une médiane — fourchette, chiffres ronds, marches d'escalier.", "Le métier d'abord — alimentaire, café, habillement, services.", "Le linéaire protégé — la vérification qui peut tout arrêter.", "Constituer le dossier"] },
];
