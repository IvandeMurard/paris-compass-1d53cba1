import fixture from "./compass-fixture.json";

export type CompassFixture = typeof fixture;
export type SharedFixture = CompassFixture["shared"];
export type AddressSlug = keyof CompassFixture["addresses"];
export type AddressFixture = CompassFixture["addresses"][AddressSlug];

export const shared: SharedFixture = fixture.shared;
export const addresses: CompassFixture["addresses"] = fixture.addresses;

export function getAddress(slug: string): AddressFixture | undefined {
  if (Object.prototype.hasOwnProperty.call(addresses, slug)) {
    return addresses[slug as AddressSlug];
  }

  return undefined;
}