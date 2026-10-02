import { createFileRoute } from "@tanstack/react-router";

import { VisitPage as VisitView } from "@/components/compass/VisitPage";
import { fr } from "@/copy/fr";
import { getAddress } from "@/data/fixture";

export const Route = createFileRoute("/contexte/$slug/visite")({
  head: ({ params }) => {
    const label = getAddress(params.slug)?.address.label;
    const title = label ? `Préparer la visite — ${label}` : fr.pages.context.absent;
    return { meta: [
      { title }, { name: "description", content: "Quand venir et quoi regarder : profil horaire des départs de la station la plus proche et compteur de passants personnel." },
      { property: "og:title", content: title }, { property: "og:description", content: "Quand venir et quoi regarder : profil horaire des départs de la station la plus proche et compteur de passants personnel." },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: VisitRoute,
});

function VisitRoute() {
  const { slug } = Route.useParams();
  const address = getAddress(slug);
  if (!address) return null;
  return <VisitView slug={slug} address={address} />;
}