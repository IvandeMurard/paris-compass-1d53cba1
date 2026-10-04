import { createFileRoute } from "@tanstack/react-router";

import { VerifyPage } from "@/components/compass";

export const Route = createFileRoute("/verifier/demo")({
  head: () => ({ meta: [
    { title: "Vérifier un dossier (maquette) — Compass" },
    { name: "description", content: "Maquette de la vérification d’un dossier Compass — non fonctionnelle." },
    { property: "og:title", content: "Vérifier un dossier (maquette) — Compass" },
    { property: "og:description", content: "Maquette de la vérification d’un dossier Compass — non fonctionnelle." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex" },
  ] }),
  component: () => <VerifyPage />,
});
