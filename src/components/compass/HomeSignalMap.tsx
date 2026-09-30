import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

import { fr } from "@/copy/fr";
import type { AddressFixture } from "@/data/fixture";

type SignalRow = AddressFixture["nearbySignals"]["rows"][number];

export function HomeSignalMap({ address, signals }: { address: AddressFixture; signals: SignalRow[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | undefined;

    void import("leaflet").then((leafletModule) => {
      if (cancelled || !containerRef.current) return;
      const L = leafletModule.default;
      const localMap = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true,
      }).setView([address.unit.lat, address.unit.lng], 15.5);
      map = localMap;
      localMap.attributionControl.setPrefix(false);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(localMap);

      const marker = (symbol: string, className: string) => L.divIcon({
        className: `compass-map-marker ${className}`,
        html: `<span aria-hidden="true">${symbol}</span>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([address.unit.lat, address.unit.lng], {
        icon: marker("●", "compass-map-marker--unit"),
        title: address.address.label,
        zIndexOffset: 1000,
      }).addTo(localMap).bindTooltip(address.address.label, { direction: "top" });

      signals.forEach((signal) => {
        if (!signal.mapPoint) return;
        L.marker([signal.mapPoint.lat, signal.mapPoint.lng], {
          icon: marker("◆", "compass-map-marker--signal"),
          title: signal.address,
        }).addTo(localMap).bindTooltip(`${signal.address} · ${signal.published_on}`, { direction: "top" });
      });
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [address, signals]);

  return (
    <div className="relative h-full min-h-[300px] overflow-hidden border-y-2 border-ink bg-field lg:min-h-[560px] lg:border-y-0 lg:border-l-2">
      <div ref={containerRef} className="compass-map h-full w-full" role="img" aria-label={fr.pages.home.map} />
      <p className="pointer-events-none absolute bottom-4 left-4 z-[500] border border-ink bg-document px-3 py-2 font-mono text-xs text-ink-2">◆ {fr.pages.home.mapLegend}</p>
    </div>
  );
}