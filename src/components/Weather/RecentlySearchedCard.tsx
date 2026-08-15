import { useWeather } from "../../hooks/useWeather";
import type { City } from "../../types/geocoding";
import type { RecentCityCurrentWeather } from "../../types/weather";
import { getWeatherIcon } from "../../utils/weatherCode";

interface RecentlySearchedCardProps {
	city: City,
	data: RecentCityCurrentWeather | undefined
}

export function RecentlySearchedCard({ city, data }: RecentlySearchedCardProps) {

	const { selectCity } = useWeather();


	const { iconUrl, label } = getWeatherIcon(data.weatherCode);

	return (
		<button onClick={() => selectCity(city)} className="bg-gray-500/20 text-white p-3 rounded-3xl w-[clamp(143px,45vw,200px)] shrink-0 select-none cursor-pointer hover:bg-gray-700/20">
			<div className="flex justify-center items-center">
				<img title={label} src={iconUrl} alt={label} className="h-16 w-16" loading="lazy" />
				<div>
					<span className="text-4xl font-medium text-gray-300">{data.temperature.toFixed(0)}</span>
					<span className="text-md text-gray-300 align-top relative top-1 left-0">{data.tempUnit}</span>
				</div>
			</div>

			<div>
				<div className="text-white text-base text-center">{city.name}, {city.country}</div>
				<div className="text-center text-gray-400/80 text-sm">{label}</div>
			</div>
		</button>
	)
}