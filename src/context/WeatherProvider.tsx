import { useState } from "react";
import { WeatherContext, type WeatherContextValue, type WeatherMode } from "./WeatherContext";
import { getCityByCoordinates } from "../services/geocoding.api";
import { getWeatherData, type GetCurrentWeatherParams } from "../services/weather.api"
import type { City } from "../types/geocoding";
import type { WeatherData } from "../types/weather";



export function WeatherProvider({ children }: { children: React.ReactNode }) {

	const [mode, setMode] = useState<WeatherMode>("checking");
	const [error, setError] = useState<string | null>(null);

	const [city, setCity] = useState<City | null>(null);
	const [curWeatherData, setCurWeatherData] = useState<WeatherData | null>(null);
	const [isLoadingCurWeather, setIsLoadingCurWeather] = useState(false);

	const fetchWeather = async (coords: GetCurrentWeatherParams, city?: City) => {
		setIsLoadingCurWeather(true);
		setError(null);

		try {
			setMode("weather");

			if (city) {
				setCity(city);
			}

			const data = await getWeatherData(coords);

			setCurWeatherData(data);

		} catch (error) {
			setError(error instanceof Error ? error.message : "Не удалось загрузить погоду");

			// Если инициализационный запрос погоды упал — всё равно нужно
			// выпустить юзера из "checking", иначе он застрянет на скелетоне.
			setMode(prev => (prev === "checking" ? "welcome" : prev));
		} finally {
			setIsLoadingCurWeather(false);
		}
	}

	const useMyLocation = () => {
		if (!navigator.geolocation) {
			setError("Геолокация не поддерживается браузером");
			return;
		}

		navigator.geolocation.getCurrentPosition(async (position) => {
			const { latitude, longitude } = position.coords;

			// Имея корды мы можем сразу запросить погоду, но для отображения нам нужны
			// данные города, страны и прочее. Из-за ограна API мы используем другой API
			// для reverse geocording(из координат получить данные о точке)
			// и параллельно получаем погоду
			try {
				// Получаем данные о городе по координатам
				const data = await getCityByCoordinates(latitude, longitude);

				// Делаем запрос погоды по координатам
				await fetchWeather({ latitude: data.latitude, longitude: data.longitude }, data);

			} catch (error) {
				console.warn("Failed to get city by coordinates", error)
			}
		},
			(error) => {
				const messages: Record<number, string> = {
					1: "Доступ к геолокации запрещён",
					2: "Геолокация недоступна",
					3: "Превышено время ожидания геолокации",
				};
				setError(messages[error.code] || "Ошибка геолокации");
				console.log(messages[error.code] || "Ошибка геолокации")
			}, {
			enableHighAccuracy: false,
			timeout: 10000,
			maximumAge: 10000
		}
		)

	}

	const value: WeatherContextValue = {
		mode,
		useMyLocation,
		error,
		isLoadingCurWeather,
		curWeatherData,
		city
	};

	return (
		<WeatherContext.Provider value={value}>
			{children}
		</WeatherContext.Provider>
	)
}