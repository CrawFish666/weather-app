import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useWeather } from "../../hooks/useWeather";
import { DailyForecastCard } from "./DailyForecastCard";
import { DailyForecastCardSkeleton } from '../Skeletons/weather/DailyForecastCardSkeleton';




export function DailyForecasts() {

	const [emblaRef] = useEmblaCarousel({
		loop: false,
		align: "start",
		dragFree: false,
		slidesToScroll: 1,
		containScroll: false,
		skipSnaps: true,
		duration: 40,
	}, [WheelGesturesPlugin({ forceWheelAxis: 'y' })])

	const { curWeatherData, isLoadingCurWeather } = useWeather();

	if (!curWeatherData && !isLoadingCurWeather) {
		return null;
	}

	return (
		<div className="embla">
			<div className="embla__viewport overflow-hidden cursor-grab" ref={emblaRef}>
				<div className="embla__container flex touch-pan-y touch-pinch-zoom gap-3">
					{isLoadingCurWeather && Array.from({ length: 7 }).map((_, index) => (
						<DailyForecastCardSkeleton key={index}/>
					))}
					{!isLoadingCurWeather && curWeatherData?.dailyNormalize.map((day, index) => (
						<DailyForecastCard
							key={day.date}
							date={day.date}
							weatherCode={day.weatherCode}
							temperatureMin={day.temperatureMin}
							temperatureMax={day.temperatureMax}
							precipitationSum={day.precipitationSum}
							tempUnitMin={day.tempUnitMin}
							tempUnitMax={day.tempUnitMax}
							isNow={index === 0}
						/>
					))}
				</div>
			</div>

		</div>
	)
}