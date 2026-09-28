import { createFileRoute } from "@tanstack/react-router";

import { MethodPage } from "@/components/compass";

export const Route = createFileRoute("/methode")({
  head: () => ({ meta: [
    { title: "Comment Compass lit-il un emplacement ? — Compass" },
    { name: "description", content: "Les principes, les sources et la fiabilité de la lecture Compass." },
    { property: "og:title", content: "Comment Compass lit-il un emplacement ? — Compass" },
    { property: "og:description", content: "Les principes, les sources et la fiabilité de la lecture Compass." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MethodPage,
});