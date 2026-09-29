import { createFileRoute } from "@tanstack/react-router";

import { LearnPage } from "@/components/compass";
import { faq, guides } from "@/content/apprendre";

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.details ? `${entry.answer} ${entry.details}` : entry.answer,
    },
  })),
};

const guideStructuredData = guides.map((guide) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: guide.title,
  description: guide.lead,
  totalTime: `PT${guide.duration.replace(" min", "M")}`,
  step: guide.outline.map((item) => ({ "@type": "HowToStep", name: item })),
}));

export const Route = createFileRoute("/apprendre")({
  head: () => ({ meta: [
    { title: "Apprendre à lire une adresse commerciale — Compass" },
    { name: "description", content: "Guides, réponses et vocabulaire pour lire un emplacement commercial parisien." },
    { property: "og:title", content: "Apprendre à lire une adresse commerciale — Compass" },
    { property: "og:description", content: "Guides, réponses et vocabulaire pour lire un emplacement commercial parisien." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ], scripts: [
    { type: "application/ld+json", children: JSON.stringify(faqStructuredData) },
    { type: "application/ld+json", children: JSON.stringify(guideStructuredData) },
  ] }),
  component: LearnPage,
});