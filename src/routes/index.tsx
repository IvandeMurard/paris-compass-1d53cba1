import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/components/compass";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Avant de signer un bail, lisez la rue — Compass" },
      { name: "description", content: "Compass lit le contexte d’une adresse commerciale parisienne à partir de données publiques." },
      { property: "og:title", content: "Avant de signer un bail, lisez la rue — Compass" },
      { property: "og:description", content: "Compass lit le contexte d’une adresse commerciale parisienne à partir de données publiques." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

