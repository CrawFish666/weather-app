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
}

export const WeatherContext = createContext<WeatherContextValue | undefined>(undefined);