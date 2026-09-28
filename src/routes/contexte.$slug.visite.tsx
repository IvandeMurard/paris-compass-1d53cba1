import { createFileRoute } from "@tanstack/react-router";

import { PlaceholderPage } from "@/components/compass";
import { fr } from "@/copy/fr";
import { getAddress } from "@/data/fixture";

export const Route = createFileRoute("/contexte/$slug/visite")({
  head: ({ params }) => {
    const label = getAddress(params.slug)?.address.label;
    const title = label ? `Préparer la visite — ${label}` : fr.pages.context.absent;
    return { meta: [
      { title }, { name: "description", content: "Préparation de visite Compass — à venir." },
      { property: "og:title", content: title }, { property: "og:description", content: "Préparation de visite Compass — à venir." },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ] };
  },
  component: VisitPage,
});

function VisitPage() {
  const { slug } = Route.useParams();
  const address = getAddress(slug);
  if (!address) return null;
  return <PlaceholderPage {...fr.pages.visit} address={address.address.label} sheet />;
}