// Все сырые даты с ответа по Api Geocoding
export interface GeocodingApiResult {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	elevation?: number;
	timezone?: string;
	feature_code?: string;

	country_code: string;
	country: string;
	country_id?: number;

	population?: number;
	postcodes?: string[];

	admin1?: string;
	admin2?: string;
	admin3?: string;
	admin4?: string;

	admin1_id?: number;
	admin2_id?: number;
	admin3_id?: number;
	admin4_id?: number;
}


export interface GeocodingApiError {
	error: true;
	reason: string;
}

export interface GeocodingApiResponse {
	results?: GeocodingApiResult[];
}

export interface City {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	country: string;
	countryCode: string;
	timezone?: string;
	state?: string;
}