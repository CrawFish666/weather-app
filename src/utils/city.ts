import type { City } from "../types/geocoding";

export function isSameCity(a: City, b: City): boolean {
	return (
		a.name.toUpperCase() === b.name.toUpperCase() &&
		a.state?.toUpperCase() === b.state?.toUpperCase() &&
		a.countryCode.toUpperCase() === b.countryCode.toUpperCase()
	);
}

export function getCityKey(city: City): string {
	return `${city.name.toUpperCase()}|${city.state?.toUpperCase() ?? ""}|${city.countryCode.toUpperCase()}`;
}