import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/kit" });
  },
  head: () => ({
    meta: [
      { title: "Compass — Fondations" },
      { name: "description", content: "Fondations visuelles de Compass, contexte commercial parisien issu de données publiques." },
      { property: "og:title", content: "Compass — Fondations" },
      { property: "og:description", content: "Fondations visuelles de Compass, contexte commercial parisien issu de données publiques." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
