import type {
	City
} from "../types/geocoding"


const REVERSE_GEOCODE_MAPS_API_URL = import.meta.env.VITE_REVERSE_GEOCODE_MAPS_API_URL;
const REVERSE_GEOCODE_MAPS_API_KEY = import.meta.env.VITE_REVERSE_GEOCODE_MAPS_API_KEY;

export interface SearchCitiesParams {
	query: string;
	count?: number;
	language?: string;
	countryCode?: string;
	signal?: AbortSignal;
}

interface ReverseGeocodingResponse {
	place_id: number;
	lat: string;
	lon: string;
	address: {
		city: string;
		state: string;
		country: string;
		country_code: string;
	}
}

export async function getCityByCoordinates(latitude: number, longitude: number, apiKey: string = REVERSE_GEOCODE_MAPS_API_KEY): Promise<City> {
	const url = new URL(REVERSE_GEOCODE_MAPS_API_URL);

	url.search = new URLSearchParams({
		lat: String(latitude),
		lon: String(longitude),
		api_key: apiKey,
		"accept-language": "ru"
	}).toString();

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Reverse geocoding failed: ${response.status}`);
	}

	const data: ReverseGeocodingResponse = await response.json();

	return {
		id: data.place_id,
		latitude: Number(data.lat),
		longitude: Number(data.lon),
		country: data.address.country,
		name: data.address.city,
		state: data.address.state,
		countryCode: data.address.country_code.toUpperCase(),
	}

}
