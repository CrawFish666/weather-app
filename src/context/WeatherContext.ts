import { createContext } from "react";
import type { WeatherData } from "../types/weather";
import type { City } from "../types/geocoding";


export type WeatherMode = "checking" | "welcome" | "weather";

export interface WeatherContextValue {
	mode: WeatherMode;
	error: string | null;

	useMyLocation: () => void;
	isLoadingCurWeather: boolean;
	curWeatherData: WeatherData | null;
	city: City | null;
	searchCities: (query: string, signal?: AbortSignal) => Promise<City[]>;
	selectCity: (city: City) => Promise<void>;
}

export const WeatherContext = createContext<WeatherContextValue | undefined>(undefined);