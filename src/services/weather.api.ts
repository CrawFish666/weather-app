import type {
	CurrentWeather,
	DailyWeather,
	HourlyByDate,
	HourlyWeather,
	RecentCityCurrentWeather,
	WeatherData
} from "../types/weather";

const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL;

// То что должен получить наша функция/сервис на вход
interface GetCurrentWeatherParams {
	latitude: number;
	longitude: number;
}

// Сырой ответ от Api open-meteo
interface WeatherApiResponse {
	timezone: string;

	current: {
		temperature_2m: number;
		weather_code: number;
		apparent_temperature: number;
		relative_humidity_2m: number;
		wind_speed_10m: number;
		precipitation: number;
		cloud_cover: number;
		pressure_msl: number;
	};
	current_units: {
		temperature_2m: string;
		wind_speed_10m: string;
	};

	hourly: {
		time: string[];
		temperature_2m: number[];
		weather_code: number[];
		precipitation_probability: number[];
		wind_speed_10m: number[];
	};
	hourly_units: {
		time: string;
		temperature_2m: string;
		weather_code: string;
		precipitation_probability: string;
		wind_speed_10m: string;
	};

	daily: {
		time: string[];
		weather_code: number[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
		precipitation_sum: number[];
		sunrise: string[];
		sunset: string[];
	};
	daily_units: {
		date: string;
		weather_code: string;
		temperature_2m_max: string;
		temperature_2m_min: string;
		precipitation_sum: string;
		sunrise: string;
		sunset: string;
	}
}

// Сырой ответ от Api для наших recent списка городов
interface RecentCityWeatherApiResponse {
	current: {
		temperature_2m: number;
		weather_code: number;
	};

	current_units: {
		temperature_2m: string;
	}
}

// Группирует часовой прогноз по дате: "2026-08-08T14:00" → попадает в ключ "2026-08-08"
function groupHourlyByDate(hourly: HourlyWeather): HourlyByDate {
	const grouped: HourlyByDate = {};

	hourly.time.forEach((time, i) => {
		const date = time.slice(0, 10); // "2026-08-08T14:00" → "2026-08-08"

		// Если нет такого ключ, то создаем его пустым
		if (!grouped[date]) {
			grouped[date] = {
				time: [],
				weatherCode: [],
				temperature: [],
				windSpeed: [],
				precipitationProbability: [],
				tempUnit: hourly.tempUnit,
				windSpeedUnit: hourly.windSpeedUnit,
				precipitationProbabilityUnity: hourly.precipitationProbabilityUnity,
			};
		}

		// Наполняем ключ(дату) значениями
		grouped[date].time.push(hourly.time[i]);
		grouped[date].weatherCode.push(hourly.weatherCode[i]);
		grouped[date].temperature.push(hourly.temperature[i]);
		grouped[date].windSpeed.push(hourly.windSpeed[i]);
		grouped[date].precipitationProbability.push(hourly.precipitationProbability[i]);
	});

	return grouped;
}

export async function getWeatherData({
	latitude,
	longitude
}: GetCurrentWeatherParams): Promise<WeatherData> {
	const url = new URL(WEATHER_API_URL);

	// Т.е. запрос api?latitude=...timezone=... преобразуем в строку
	url.search = new URLSearchParams({
		latitude: String(latitude),
		longitude: String(longitude),
		current: "temperature_2m,weather_code,wind_speed_10m",
		hourly: "temperature_2m,weather_code,precipitation_probability,wind_speed_10m",
		daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset",
		timezone: "auto"
	}).toString();

	const resp = await fetch(url);

	if (!resp.ok) {
		throw new Error(`Weather request failed: ${resp.status}`);
	}

	const data: WeatherApiResponse = await resp.json();

	// Сборка полученных данных в наш интерфейс
	const current: CurrentWeather = {
		weatherCode: data.current.weather_code,
		temperature: data.current.temperature_2m,
		windSpeed: data.current.wind_speed_10m,
		tempUnit: data.current_units.temperature_2m,
		windSpeedUnit: data.current_units.wind_speed_10m
	};

	const rawHourly: HourlyWeather = {
		time: data.hourly.time,
		weatherCode: data.hourly.weather_code,
		temperature: data.hourly.temperature_2m,
		windSpeed: data.hourly.wind_speed_10m,
		precipitationProbability: data.hourly.precipitation_probability,
		tempUnit: data.hourly_units.temperature_2m,
		windSpeedUnit: data.hourly_units.wind_speed_10m,
		precipitationProbabilityUnity: data.hourly_units.precipitation_probability
	}

	const hourlyByDate = groupHourlyByDate(rawHourly);

	const daily: DailyWeather = {
		date: data.daily.time,
		weatherCode: data.daily.weather_code,
		temperatureMin: data.daily.temperature_2m_min,
		temperatureMax: data.daily.temperature_2m_max,
		precipitationSum: data.daily.precipitation_sum,
		tempUnitMax: data.daily_units.temperature_2m_max,
		tempUnitMin: data.daily_units.temperature_2m_min
	}

	return {
		current,
		hourlyByDate,
		daily,
		timezone: data.timezone
	}
}

// Получаем current temp для recent городов
export async function getCurrentWeatherForRecentCities(cities: GetCurrentWeatherParams[]): Promise<RecentCityCurrentWeather[]> {
	if (cities.length === 0) return [];

	const url = new URL(WEATHER_API_URL);

	url.search = new URLSearchParams({
		latitude: cities.map(city => city.latitude).join(","),
		longitude: cities.map(city => city.longitude).join(","),
		current: "temperature_2m,weather_code",
		timezone: "auto"
	}).toString()

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Batch weather request failed: ${response.status}`);
	}

	// принимаем сырые данные
	const rawData = await response.json();

	// Нормализуем и делаем всегда массив!
	const data: RecentCityWeatherApiResponse[] = Array.isArray(rawData) ? rawData : [rawData];

	return data.map(item => ({
		temperature: item.current.temperature_2m,
		tempUnit: item.current_units.temperature_2m,
		weatherCode: item.current.weather_code
	}))
}