import type { City } from "../types/geocoding";
import { getFromLocalStorage, removeFromLocalStorage, saveToLocalStorage } from "../utils/storage";


const RECENT_CITIES_KEY = "weather_recent_cities";
const MAX_RECENT_CITIES = 10;

export function isSameCity(a: City, b: City): boolean {
	return (
		a.name.toUpperCase() === b.name.toUpperCase() && 
		a.state?.toUpperCase() === b.state?.toUpperCase() && 
		a.countryCode.toUpperCase() === b.countryCode.toUpperCase()
	)
}

export function getRecentCities(): City[] {
	return getFromLocalStorage<City[]>(RECENT_CITIES_KEY, []);
}

export function addRecentCity(city: City): void {
	const cities = getRecentCities();

	const filteredCities = cities.filter(item => !isSameCity(item, city));

	const updatedCities = [city, ...filteredCities].slice(0, MAX_RECENT_CITIES);

	saveToLocalStorage(RECENT_CITIES_KEY, updatedCities);
}

export function removeRecentCity(city: City): void {
	const cities = getRecentCities();

	const updatedCities = cities.filter(
		item => !isSameCity(item, city)
	);

	saveToLocalStorage(
		RECENT_CITIES_KEY,
		updatedCities
	);
}

export function clearRecentCities(): void {
	removeFromLocalStorage(RECENT_CITIES_KEY);
}