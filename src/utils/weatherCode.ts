import clearDay from "@meteocons/svg/fill/clear-day.svg";
import mostlyClearDay from "@meteocons/svg/fill/mostly-clear-day.svg";
import partlyCloudyDay from "@meteocons/svg/fill/partly-cloudy-day.svg";
import cloudy from "@meteocons/svg/fill/cloudy.svg";
import fog from "@meteocons/svg/fill/fog.svg";
import drizzle from "@meteocons/svg/fill/drizzle.svg";
import rain from "@meteocons/svg/fill/rain.svg";
import sleet from "@meteocons/svg/fill/sleet.svg";
import snow from "@meteocons/svg/fill/snow.svg";
import snowflake from "@meteocons/svg/fill/snowflake.svg";
import thunderstorms from "@meteocons/svg/fill/thunderstorms.svg";
import thunderstormsHail from "@meteocons/svg/fill/thunderstorms-hail.svg";
import extremeThunderstormsHail from "@meteocons/svg/fill/extreme-thunderstorms-hail.svg";
import extremeRain from "@meteocons/svg/fill/extreme-rain.svg";
import extremeSnow from "@meteocons/svg/fill/extreme-snow.svg";
import partlyCloudyDayRain from "@meteocons/svg/fill/partly-cloudy-day-rain.svg";
import partlyCloudyDaySnow from "@meteocons/svg/fill/partly-cloudy-day-snow.svg";
import overcastRain from "@meteocons/svg/fill/overcast-rain.svg";
import overcastSnow from "@meteocons/svg/fill/overcast-snow.svg";
import overcastDrizzle from "@meteocons/svg/fill/overcast-drizzle.svg";
import extremeDrizzle from "@meteocons/svg/fill/extreme-drizzle.svg";
import extremeSleet from "@meteocons/svg/fill/extreme-sleet.svg";

export interface WeatherIconEntry {
	iconUrl: string;
	label: string;
}

export const WMO_CODES: Record<number, WeatherIconEntry> = {
	0: {
		iconUrl: clearDay,
		label: "Ясно"
	},

	1: {
		iconUrl: mostlyClearDay,
		label: "Преимущественно ясно"
	},

	2: {
		iconUrl: partlyCloudyDay,
		label: "Переменная облачность"
	},

	3: {
		iconUrl: cloudy,
		label: "Пасмурно"
	},

	45: {
		iconUrl: fog,
		label: "Туман"
	},

	48: {
		iconUrl: fog,
		label: "Изморозь"
	},

	51: {
		iconUrl: drizzle,
		label: "Лёгкая морось"
	},

	53: {
		iconUrl: overcastDrizzle,
		label: "Морось"
	},

	55: {
		iconUrl: extremeDrizzle,
		label: "Сильная морось"
	},

	56: {
		iconUrl: sleet,
		label: "Лёгкая ледяная морось"
	},

	57: {
		iconUrl: extremeSleet,
		label: "Сильная ледяная морось"
	},

	61: {
		iconUrl: rain,
		label: "Небольшой дождь"
	},

	63: {
		iconUrl: overcastRain,
		label: "Дождь"
	},

	65: {
		iconUrl: extremeRain,
		label: "Сильный дождь"
	},

	66: {
		iconUrl: sleet,
		label: "Лёгкий ледяной дождь"
	},

	67: {
		iconUrl: extremeSleet,
		label: "Сильный ледяной дождь"
	},

	71: {
		iconUrl: snow,
		label: "Небольшой снег"
	},

	73: {
		iconUrl: overcastSnow,
		label: "Снег"
	},

	75: {
		iconUrl: extremeSnow,
		label: "Сильный снег"
	},

	77: {
		iconUrl: snowflake,
		label: "Снежные зёрна"
	},

	80: {
		iconUrl: partlyCloudyDayRain,
		label: "Небольшие ливни"
	},

	81: {
		iconUrl: rain,
		label: "Ливни"
	},

	82: {
		iconUrl: extremeRain,
		label: "Сильные ливни"
	},

	85: {
		iconUrl: partlyCloudyDaySnow,
		label: "Небольшой снегопад"
	},

	86: {
		iconUrl: extremeSnow,
		label: "Сильный снегопад"
	},

	95: {
		iconUrl: thunderstorms,
		label: "Гроза"
	},

	96: {
		iconUrl: thunderstormsHail,
		label: "Гроза с небольшим градом"
	},

	99: {
		iconUrl: extremeThunderstormsHail,
		label: "Гроза с сильным градом"
	},
};
const UNKNOWN_WEATHER: WeatherIconEntry = {
	iconUrl: cloudy,
	label: "Неизвестно"
};

export function getWeatherIcon(code: number): WeatherIconEntry {
	return WMO_CODES[code] ?? UNKNOWN_WEATHER;
}