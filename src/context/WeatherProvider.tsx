import { useCallback, useEffect, useRef, useState } from "react";
import { WeatherContext, type WeatherContextValue, type WeatherMode } from "./WeatherContext";
import { getCityByCoordinates } from "../services/geocoding.api";
import { getCurrentWeatherForRecentCities, getWeatherData, type GetCurrentWeatherParams } from "../services/weather.api"
import { searchCities as searchCitiesApi } from "../services/geocoding.api";
import type { City } from "../types/geocoding";
import type { WeatherData, RecentCityCurrentWeather } from "../types/weather";
import { addRecentCity, getRecentCities } from "../services/recentCities.service";
import { getCityKey } from "../utils/city";
import { getApiErrorMessage } from "../services/apiRequest";



export function WeatherProvider({ children }: { children: React.ReactNode }) {

	const [mode, setMode] = useState<WeatherMode>("checking");
	const [isWelcomeActionLoading, setIsWelcomeActionLoading] = useState(false);
	const [welcomeLoadingMessage, setWelcomeLoadingMessage] = useState<string | null>(null);

	const [error, setError] = useState<string | null>(null);
	const [weatherError, setWeatherError] = useState<string | null>(null);

	const [city, setCity] = useState<City | null>(null);
	const [curWeatherData, setCurWeatherData] = useState<WeatherData | null>(null);
	const [isLoadingCurWeather, setIsLoadingCurWeather] = useState(false);

	const [recentCities, setRecentCities] = useState<City[]>(getRecentCities);
	const [recentCitiesWeather, setRecentCitiesWeather] = useState<Record<string, RecentCityCurrentWeather>>({});
	const [isLoadingRecentWeather, setIsLoadingRecentWeather] = useState(false);
	const [recentWeatherError, setRecentWeatherError] = useState<string | null>(null);

	const lastWeatherRequestRef = useRef<{
		coords: GetCurrentWeatherParams;
		city?: City;
	} | null>(null);
	const didInitRef = useRef(false);

	const addCityToRecent = useCallback((city: City) => {
		const updatedCities = addRecentCity(city);

		setRecentCities(updatedCities);

		return updatedCities;
	}, []);

	const fetchWeather = useCallback(async (coords: GetCurrentWeatherParams, city?: City) => {
		lastWeatherRequestRef.current = { coords, city };
		setIsLoadingCurWeather(true);
		setWeatherError(null);

		try {
			
			

			const data = await getWeatherData(coords);
			setCurWeatherData(data);
			setMode("weather");
			if (city) {
				setCity(city);
			}

		} catch (error) {
			setWeatherError(getApiErrorMessage(error, "API погоды"));
			console.error("Failed to load weather", error);

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
			setRecentWeatherError(null);
			return;
		}

		setIsLoadingRecentWeather(true);
		setRecentWeatherError(null);;

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
			setRecentWeatherError(
				getApiErrorMessage(error, "API погоды для недавних городов")
			);
		} finally {
			setIsLoadingRecentWeather(false);
		}
	}, []);

	const retryWeather = useCallback(async () => {
		const request = lastWeatherRequestRef.current;
		if (!request) return;

		await Promise.allSettled([
			fetchWeather(request.coords, request.city),
			fetchRecentCitiesWeather(recentCities),
		]);
	}, [fetchWeather, fetchRecentCitiesWeather, recentCities]);

	const useMyLocation = useCallback(() => {
		setError(null);
		if (!navigator.geolocation) {
			setError("Геолокация не поддерживается браузером");
			return;
		}

		const showSplash = mode === "welcome";
		const finishWelcomeAction = () => {
			if (!showSplash) return;

			setIsWelcomeActionLoading(false);
			setWelcomeLoadingMessage(null);
		};

		if (showSplash) {
			setIsWelcomeActionLoading(true);
			setWelcomeLoadingMessage("Определяем местоположение...");
		}

		navigator.geolocation.getCurrentPosition(async (position) => {
			const { latitude, longitude } = position.coords;

			try {
				if (showSplash) {
					setWelcomeLoadingMessage("Определяем город...");
				}

				const data = await getCityByCoordinates(latitude, longitude);
				const updatedRecentCities = addCityToRecent(data);

				if (showSplash) {
					setWelcomeLoadingMessage("Загружаем погоду...");
				}

				// Делаем запрос погоды по координатам + запрос для recent городов
				await Promise.allSettled([
					fetchWeather({ latitude: data.latitude, longitude: data.longitude }, data),
					fetchRecentCitiesWeather(updatedRecentCities)
				])
			} catch (error) {
				console.warn("Failed to get city by coordinates", error);
				setError(getApiErrorMessage(error, "API обратного геокодирования"));
			} finally {
				finishWelcomeAction();
			}
		}, (error) => {
			const messages: Record<number, string> = {
				1: "Доступ к геолокации запрещён",
				2: "Геолокация недоступна",
				3: "Превышено время ожидания геолокации",
			};
			setError(messages[error.code] || "Ошибка геолокации");
			finishWelcomeAction();
		},
			{
				enableHighAccuracy: false,
				timeout: 10000,
				maximumAge: 10000,
			}
	);
			
			

	
			
	}, [mode, addCityToRecent, fetchWeather, fetchRecentCitiesWeather]);

	const searchCities = useCallback(
		(query: string, signal?: AbortSignal): Promise<City[]> => {
			return searchCitiesApi({
				query,
				signal
			});
		},
		[]
	);

	const selectCity = useCallback(async (city: City) => {
		const showSplash = mode === "welcome";

		if (showSplash) {
			setIsWelcomeActionLoading(true);
			setWelcomeLoadingMessage("Загружаем погоду...");
		}

		try {
			const updatedRecentCities = addCityToRecent(city);

			await Promise.allSettled([
				fetchWeather(
					{ latitude: city.latitude, longitude: city.longitude },
					city
				),
				fetchRecentCitiesWeather(updatedRecentCities),
			]);
		} finally {
			if (showSplash) {
				setIsWelcomeActionLoading(false);
				setWelcomeLoadingMessage(null);
			}
		}

	}, [mode,	fetchWeather, addCityToRecent, fetchRecentCitiesWeather])

	const initializeApp = useCallback(async () => {
		if (didInitRef.current) return;

		didInitRef.current = true;

		if (recentCities.length > 0) {
			const lastCity = recentCities[0];
			await Promise.allSettled([
				fetchWeather({ latitude: lastCity.latitude, longitude: lastCity.longitude }, lastCity),
				fetchRecentCitiesWeather(recentCities)
			])

		} else {
			setMode("welcome");
		}
	}, [recentCities, fetchWeather, fetchRecentCitiesWeather]);

	useEffect(() => {
		initializeApp()

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
		isLoadingRecentWeather,
		weatherError,
		retryWeather,
		recentWeatherError,
		isWelcomeActionLoading,
		welcomeLoadingMessage,
	};

	return (
		<WeatherContext.Provider value={value}>
			{children}
		</WeatherContext.Provider>
	)
}