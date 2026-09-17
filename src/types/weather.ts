// То что мы должны получить в ответе по API
export interface CurrentWeather {
	temperature: number;
	tempUnit: string;
	weatherCode: number;
	windSpeed: number;
	windSpeedUnit: string;
}

export interface HourlyWeather {
	time: string[];
	temperature: number[];
	weatherCode: number[];
	precipitationProbability: number[];
	windSpeed: number[];
	tempUnit: string;
	windSpeedUnit: string;
	precipitationProbabilityUnity: string;
}

export interface DailyWeather {
	date: string[];
	weatherCode: number[];
	temperatureMin: number[];
	temperatureMax: number[];
	precipitationSum: number[];
	tempUnitMax: string;
	tempUnitMin: string;
};

// Часовой прогноз, сгруппированный по дате ("YYYY-MM-DD" → HourlyWeather за этот день)
export type HourlyByDate = Record<string, HourlyWeather>;

export interface RecentCityCurrentWeather {
	temperature: number;
	tempUnit: string;
	weatherCode: number;
}

// Объединенный тип
export interface WeatherData {
	current: CurrentWeather;
	hourlyByDate: HourlyByDate;
	daily: DailyWeather;
	timezone: string;
}