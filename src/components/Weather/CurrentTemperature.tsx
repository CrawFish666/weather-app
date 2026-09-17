import { useWeather } from "../../hooks/useWeather";
import { getWeatherIcon } from "../../utils/weatherCode";
import { CurrentTemperatureSkeleton } from "../Skeletons/weather/CurrentTemperatureSkeleton";



export function CurrentTemperature() {

	const { curWeatherData, isLoadingCurWeather } = useWeather();

	const current = curWeatherData?.current;
	const daily = curWeatherData?.daily;

	if (isLoadingCurWeather) {
		return (
			<CurrentTemperatureSkeleton />
		)
	}

	return (
		<section className="">
			<div className="flex gap-5 items-center">
				<div className="text-white flex gap-2 items-start">
					<span className="text-8xl leading-none">{current?.temperature.toFixed(0)}</span>
					<span className="text-4xl leading-none align-top relative top-3 left-0">{current?.tempUnit}</span>
				</div>
				<div className="flex flex-col gap-2">
					<div className="bg-gray-500/20 py-1 px-5 rounded-full flex gap-5">
						<span className="text-gray-400">H</span>
						<div className="text-white">
							<span>{daily?.temperatureMax[0].toFixed(0)}</span>
							<span className="text-xs text-gray-400/80 align-top relative top-0.5 left-0">{daily?.tempUnitMax}</span>
						</div>
					</div>
					<div className="bg-gray-500/20 py-1 px-5 rounded-full flex gap-5">
						<span className="text-gray-400">L</span>
						<div className="text-white">
							<span>{daily?.temperatureMin[0].toFixed(0)}</span>
							<span className="text-xs  align-top relative top-0.5 left-0">{daily?.tempUnitMin}</span>
						</div>
					</div>
				</div>
			</div>
			{current?.weatherCode !== undefined && (
				<div className="flex items-center gap-2">
					<img src={getWeatherIcon(current?.weatherCode).iconUrl} alt={getWeatherIcon(current?.weatherCode).label} className="w-12 h-12" />
					<span className="text-white text-lg">{getWeatherIcon(current?.weatherCode).label}</span>
				</div>)}
		</section>
	)
}