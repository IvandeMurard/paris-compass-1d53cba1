import { createFileRoute } from "@tanstack/react-router";

import { PlaceholderPage } from "@/components/compass";
import { fr } from "@/copy/fr";

export const Route = createFileRoute("/verifier/demo")({
  head: () => ({ meta: [
    { title: "Vérifier un dossier — Compass" },
    { name: "description", content: "Vérification d’un dossier Compass — à venir." },
    { property: "og:title", content: "Vérifier un dossier — Compass" },
    { property: "og:description", content: "Vérification d’un dossier Compass — à venir." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <PlaceholderPage {...fr.pages.verify} />,
});