import { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";

export function useWeather() {
	const context = useContext(WeatherContext);

	if (context === undefined) {
		throw new Error("useWeather должен использоваться внутри WeatherProvider");
	}

	return context;
}