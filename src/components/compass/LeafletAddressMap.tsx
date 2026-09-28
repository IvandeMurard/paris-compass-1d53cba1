import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";

import { fr } from "@/copy/fr";
import type { AddressFixture } from "@/data/fixture";

export type MapView = "unit" | "segment" | "near" | "wide";

const zoomByView: Record<MapView, number> = {
  unit: 17,
  segment: 16,
  near: 15.7,
  wide: 14.8,
};

type LeafletAddressMapProps = {
  address: AddressFixture;
  view: MapView;
  compact: boolean;
};

export function LeafletAddressMap({ address, view, compact }: LeafletAddressMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const unitMarkerRef = useRef<Marker | null>(null);

  useEffect(() => {
    let cancelled = false;
    let localMap: LeafletMap | undefined;

    void import("leaflet").then((leafletModule) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      const L = leafletModule.default;
      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true,
      }).setView([address.unit.lat, address.unit.lng], zoomByView.unit);
      localMap = map;
      mapRef.current = map;
      map.attributionControl.setPrefix(false);
      map.attributionControl.addAttribution(fr.addressSheet.mapNoBasemap);

      const icon = (symbol: string, className = "") => L.divIcon({
        className: `compass-map-marker ${className}`,
        html: `<span aria-hidden="true">${symbol}</span>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      address.premises400m.rows.forEach((premise) => {
        L.marker([premise.lat, premise.lng], { icon: icon("□"), interactive: false }).addTo(map);
      });

      address.nearbySignals.rows.forEach((signal) => {
        if (!signal.mapPoint) return;
        L.marker([signal.mapPoint.lat, signal.mapPoint.lng], {
          icon: icon("◆", "compass-map-marker--signal"),
          title: signal.address,
        }).addTo(map).bindTooltip(signal.address, { direction: "top" });
      });

      unitMarkerRef.current = L.marker([address.unit.lat, address.unit.lng], {
        icon: icon("●", "compass-map-marker--unit"),
        title: address.address.label,
        zIndexOffset: 1000,
      }).addTo(map).bindTooltip(address.address.label, { direction: "top" });
    });

    return () => {
      cancelled = true;
      unitMarkerRef.current = null;
      if (localMap) localMap.remove();
      if (mapRef.current === localMap) mapRef.current = null;
    };
  }, [address]);

  useEffect(() => {
    mapRef.current?.flyTo([address.unit.lat, address.unit.lng], zoomByView[view], { duration: 0.75 });
  }, [address.unit.lat, address.unit.lng, view]);

  useEffect(() => {
    const timer = window.setTimeout(() => mapRef.current?.invalidateSize(), 260);
    return () => window.clearTimeout(timer);
  }, [compact]);

  return (
    <div className="relative h-full min-h-0 overflow-hidden border-b-2 border-ink bg-field lg:border-b-0 lg:border-l-2">
      <div ref={containerRef} className="compass-map h-full w-full" role="img" aria-label={fr.addressSheet.map} />
      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] border border-ink bg-document px-3 py-2 font-mono text-xs leading-5 text-ink-2">
        <span className="mr-3">□ {fr.addressSheet.mapPremises}</span>
        <span className="mr-3">● {fr.addressSheet.mapUnit}</span>
        <span>◆ {fr.addressSheet.mapSignals}</span>
      </div>
    </div>
  );
}