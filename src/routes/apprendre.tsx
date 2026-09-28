import { createFileRoute } from "@tanstack/react-router";

import { PlaceholderPage } from "@/components/compass";
import { fr } from "@/copy/fr";

export const Route = createFileRoute("/apprendre")({
  head: () => ({ meta: [
    { title: "Apprendre à lire une adresse commerciale — Compass" },
    { name: "description", content: "Guides, réponses et vocabulaire pour lire un emplacement commercial parisien." },
    { property: "og:title", content: "Apprendre à lire une adresse commerciale — Compass" },
    { property: "og:description", content: "Guides, réponses et vocabulaire pour lire un emplacement commercial parisien." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <PlaceholderPage {...fr.pages.learn} />,
});