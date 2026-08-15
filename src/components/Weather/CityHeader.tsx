import { MapPin } from "lucide-react";
import type { City } from "../../types/geocoding";
import { formatDayMonthWeekday } from "../../utils/date";
import { CityHeaderSkeleton } from "../Skeletons/weather/CityHeaderSkeleton";
import { useWeather } from "../../hooks/useWeather";



export function CityHeader() {

	const { curWeatherData, isLoadingCurWeather, city } = useWeather();
	const todayDate = curWeatherData?.daily.date[0];

	if (isLoadingCurWeather) {
		return (
			<CityHeaderSkeleton />
		)
	}

	return (
		<section className="flex items-start">
			<MapPin className="fill-white w-5 h-5" />
			<div className="flex flex-col">
				<span className="text-white leading-none">{city?.name} {city?.state}, {city?.country}</span>
				<span className="text-white/70 leading-none">{todayDate && formatDayMonthWeekday(todayDate)}</span>
			</div>
		</section>
	)
}