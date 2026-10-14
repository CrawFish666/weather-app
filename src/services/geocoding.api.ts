import type {
	City,
	GeocodingApiResponse,
	GeocodingApiResult,
} from "../types/geocoding"

import { fetchJson } from "./apiRequest";

const GEOCODE_API_URL = import.meta.env.VITE_GEOCODE_API_URL;
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
		city?: string;
		town?: string;
		village?: string;
		hamlet?: string;
		municipality?: string;
		county?: string;
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

	const data = await fetchJson<ReverseGeocodingResponse>(url);

	return {
		id: data.place_id,
		latitude: Number(data.lat),
		longitude: Number(data.lon),
		country: data.address.country,
		name:
			data.address.city ??
			data.address.town ??
			data.address.village ??
			data.address.hamlet ??
			data.address.municipality ??
			data.address.county ??
			"Неизвестный населённый пункт",
		state: data.address.state,
		countryCode: data.address.country_code.toUpperCase(),
	}

}

function mapCity(result: GeocodingApiResult): City {
	return {
		id: result.id,
		name: result.name,
		latitude: result.latitude,
		longitude: result.longitude,
		country: result.country,
		countryCode: result.country_code.toUpperCase(),
		state: result.admin1
	};
}

export async function searchCities({
	query,
	count = 5,
	language = "ru",
	countryCode,
	signal
}: SearchCitiesParams): Promise<City[]> {

	// Некая защита от пробелов и если длина <2 символов просто ничего не делаем
	const trimmedQuery = query.trim();

	if (trimmedQuery.length < 2) return [];

	const url = new URL(GEOCODE_API_URL);

	// Преобразуем параметры в объект
	const params = new URLSearchParams({
		name: trimmedQuery,
		count: String(count),
		language,
	})

	// Если пользак передает countryCode, то пихаем в объект параметров
	if (countryCode) {
		params.set("countryCode", countryCode);
	}

	// Преобразуем объект параметров в строку и пихаем в объект для поиска
	url.search = params.toString();

	const data = await fetchJson<GeocodingApiResponse>(url, { signal });

	// Преобразуем ответ в нужные нам данные, либо в пустоту.
	return data.results?.map(mapCity) ?? [];
}

