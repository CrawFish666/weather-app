import { useCallback, useEffect, useRef, useState } from "react";
import { WeatherContext, type WeatherContextValue, type WeatherMode } from "./WeatherContext";
import { getCityByCoordinates } from "../services/geocoding.api";
import { getCurrentWeatherForRecentCities, getWeatherData, type GetCurrentWeatherParams } from "../services/weather.api"
import { searchCities as searchCitiesApi } from "../services/geocoding.api";
import type { City } from "../types/geocoding";
import type { WeatherData, RecentCityCurrentWeather } from "../types/weather";
import { addRecentCity, getRecentCities } from "../services/recentCities.service";
import { getCityKey } from "../utils/city";



export function WeatherProvider({ children }: { children: React.ReactNode }) {

	const [mode, setMode] = useState<WeatherMode>("checking");
	const [error, setError] = useState<string | null>(null);

	const [city, setCity] = useState<City | null>(null);
	const [curWeatherData, setCurWeatherData] = useState<WeatherData | null>(null);
	const [isLoadingCurWeather, setIsLoadingCurWeather] = useState(false);

	const [recentCities, setRecentCities] = useState<City[]>(getRecentCities);
	const [recentCitiesWeather, setRecentCitiesWeather] = useState<Record<string, RecentCityCurrentWeather>>({});
	const [isLoadingRecentWeather, setIsLoadingRecentWeather] = useState(false);

	const didInitRef = useRef(false);

	const addCityToRecent = useCallback((city: City) => {
		const updatedCities = addRecentCity(city);

		setRecentCities(updatedCities);

		return updatedCities;
	}, []);

	const fetchWeather = useCallback(async (coords: GetCurrentWeatherParams, city?: City) => {
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
	}, [])

	const fetchRecentCitiesWeather = useCallback(async (cities: City[]) => {
		if (cities.length === 0) {
			setRecentCitiesWeather({});
			return;
		}

		setIsLoadingRecentWeather(true);

		try {
			const data = await getCurrentWeatherForRecentCities(cities);

			const weatherMap: Record<string, RecentCityCurrentWeather> = {};

			data.forEach((weather, index) => {
				const city = cities[index];

				if (!city) return;

				weatherMap[getCityKey(city)] = weather;
			});

			setRecentCitiesWeather(weatherMap);
		} catch (error) {
			console.error("Failed to load recent cities weather", error);
		} finally {
			setIsLoadingRecentWeather(false);
		}
	}, []);

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

				// 
				const updatedRecentCities = addCityToRecent(data);

				// Делаем запрос погоды по координатам + запрос для recent городов
				Promise.allSettled([
					fetchWeather({ latitude: data.latitude, longitude: data.longitude }, data),
					fetchRecentCitiesWeather(updatedRecentCities)
				])

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

	const searchCities = useCallback(
		async (query: string, signal?: AbortSignal): Promise<City[]> => {
			return searchCitiesApi({
				query,
				signal
			});
		},
		[]
	);

	const selectCity = useCallback(async (city: City) => {
		const updatedRecentCities = addCityToRecent(city);

		await Promise.allSettled([
			fetchWeather({ latitude: city.latitude, longitude: city.longitude }, city),
			fetchRecentCitiesWeather(updatedRecentCities)
		])

	}, [fetchWeather, addCityToRecent, fetchRecentCitiesWeather])

	const initializeApp = useCallback(async () => {
		if (didInitRef.current) return;

		didInitRef.current = true;
		const recent = getRecentCities();
		// setRecentSearches(recent);

		if (recent.length > 0) {
			const lastCity = recent[0];
			await Promise.allSettled([
				fetchWeather({ latitude: lastCity.latitude, longitude: lastCity.longitude }, lastCity),
				fetchRecentCitiesWeather(recent)
			])

		} else {
			setMode("welcome");
		}
	}, [fetchWeather, fetchRecentCitiesWeather]);

	useEffect(() => {
		const timer = setTimeout(initializeApp, 1500);

		return () => clearTimeout(timer);

	}, [initializeApp])


	const value: WeatherContextValue = {
		mode,
		useMyLocation,
		error,
		isLoadingCurWeather,
		curWeatherData,
		city,
		searchCities,
		selectCity,
		recentCities,
		recentCitiesWeather,
		isLoadingRecentWeather
	};

	return (
		<WeatherContext.Provider value={value}>
			{children}
		</WeatherContext.Provider>
	)
}