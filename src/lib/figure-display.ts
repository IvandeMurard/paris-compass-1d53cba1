import type { AddressFixture } from "@/data/fixture";

type FigureRow = AddressFixture["dossier"]["figures"][number];

export type PublicFigureDisplay = {
  label: string;
  value: number;
  scale: string;
};

export function getPublicFigureDisplay(figure: FigureRow): PublicFigureDisplay | undefined {
  const operands = figure.derivation.operands;

  if (figure.axis === "density" && typeof operands.n === "number") {
    return { label: "Tissu commercial", value: operands.n, scale: "locaux à 400 m" };
  }

  if (figure.axis === "rail" && typeof operands.d === "number") {
    return { label: "Desserte ferrée", value: Math.round(operands.d), scale: "m jusqu’à la station" };
  }

  if (figure.axis === "services") {
    const counts = Object.values(operands).filter((value): value is number => typeof value === "number");
    return { label: "Services marchands à pied", value: counts.reduce((total, value) => total + value, 0), scale: "commerces à 400 m" };
  }

  if (figure.axis === "alimentaire" && typeof operands.n === "number") {
    return { label: "Commerces alimentaires", value: operands.n, scale: "commerces à 400 m" };
  }

  if (figure.axis === "noise" && typeof operands.voies === "number") {
    return { label: "Bruit routier", value: operands.voies, scale: "voies à 500 m" };
  }

  return undefined;
}