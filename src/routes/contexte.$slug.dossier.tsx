import { createFileRoute } from "@tanstack/react-router";

import { DossierPage } from "@/components/compass";
import { fr } from "@/copy/fr";
import { getAddress } from "@/data/fixture";

export const Route = createFileRoute("/contexte/$slug/dossier")({
  head: ({ params }) => {
    const label = getAddress(params.slug)?.address.label;
    const title = label ? `Dossier — ${label}` : fr.pages.context.absent;
    const description = label ? `Étude d’emplacement pour ${label}, composée à partir de données publiques.` : fr.pages.context.absent;
    return { meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ] };
  },
  component: DossierPage,
});

function DossierPage() {
  const { slug } = Route.useParams();
  const address = getAddress(slug);
  if (!address) return null;
  return <DossierPage address={address} />;
}