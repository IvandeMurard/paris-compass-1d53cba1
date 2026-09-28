import { createFileRoute } from "@tanstack/react-router";

import { PlaceholderPage } from "@/components/compass";
import { fr } from "@/copy/fr";
import { getAddress } from "@/data/fixture";

export const Route = createFileRoute("/contexte/$slug/")({
  head: ({ params }) => {
    const address = getAddress(params.slug);
    const title = address ? `${address.address.label} — Compass` : fr.pages.context.absent;
    const description = address ? `Contexte commercial de ${address.address.label}, lu à partir de données publiques.` : fr.pages.context.absent;
    return { meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ] };
  },
  component: ContextPage,
});

function ContextPage() {
  const { slug } = Route.useParams();
  const address = getAddress(slug);
  if (!address) return null;
  return <PlaceholderPage {...fr.pages.context} address={address.address.label} sheet />;
}