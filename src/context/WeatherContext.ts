import { createContext } from "react";
import type { WeatherData, RecentCityCurrentWeather } from "../types/weather";
import type { City } from "../types/geocoding";


export type WeatherMode = "checking" | "welcome" | "weather";

export interface WeatherContextValue {
	mode: WeatherMode;
	isWelcomeActionLoading: boolean;
	welcomeLoadingMessage: string | null;

	error: string | null;
	weatherError: string | null;
	retryWeather: () => Promise<void>;

	useMyLocation: () => void;
	isLoadingCurWeather: boolean;
	recentWeatherError: string | null;

	curWeatherData: WeatherData | null;
	city: City | null;
	searchCities: (query: string, signal?: AbortSignal) => Promise<City[]>;
	selectCity: (city: City) => Promise<void>;
	recentCities: City[];
	recentCitiesWeather: Record<string, RecentCityCurrentWeather>;
	isLoadingRecentWeather: boolean;

}

export const WeatherContext = createContext<WeatherContextValue | undefined>(undefined);