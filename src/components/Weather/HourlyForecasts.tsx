import { HourlyForecastCard } from "./HourlyForecastCard";
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { getCurrentHourKey } from "../../utils/date";
import { useEffect } from "react";
import { HourlyForecastCardSkeleton } from "../Skeletons/weather/HourlyForecastCardSkeleton";
import { useWeather } from "../../hooks/useWeather";




export function HourlyForecasts() {

	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: false,
		align: "start",
		dragFree: false,
		slidesToScroll: 1,
		// startIndex: 5,
		containScroll: false,
		skipSnaps: true,
		// dragThreshold: 25,
		duration: 40
	}, [WheelGesturesPlugin({ forceWheelAxis: 'y' })])

	const { curWeatherData, isLoadingCurWeather } = useWeather();

	const todayDate = curWeatherData?.daily.date[0];
	const todayHourly = todayDate ? curWeatherData?.hourlyByDate[todayDate] : undefined;

	const currentHourKey = curWeatherData?.timezone ? getCurrentHourKey(curWeatherData?.timezone) : null;

	// Скроллит к текущему часу при инициализации карусели И при смене города/данных
	useEffect(() => {
		if (!emblaApi || isLoadingCurWeather || !todayHourly || !currentHourKey) return;

		const index = todayHourly.time.indexOf(currentHourKey);
		if (index === -1) return;

		emblaApi.scrollTo(index, true); // true = мгновенно, без анимации
	}, [emblaApi, todayHourly, currentHourKey]);

	if (!todayHourly && !isLoadingCurWeather) {
		return null;
	}




	return (
		<section>
			<h2 className="mb-4 text-lg font-semibold text-gray-400/80">Today's Forecast</h2>
			<div className="embla">
				<div className="embla__viewport overflow-hidden cursor-grab" ref={emblaRef}>
					<div className="embla__container flex touch-pan-y touch-pinch-zoom gap-3">
						{isLoadingCurWeather && Array.from({ length: 24 }).map((_, index) => (
							<HourlyForecastCardSkeleton key={index} />
						))}
						{!isLoadingCurWeather && todayHourly?.time.map((time, index) => (
							<HourlyForecastCard
								key={time}
								time={time}
								weatherCode={todayHourly.weatherCode[index]}
								temperature={todayHourly.temperature[index]}
								tempUnit={todayHourly.tempUnit}
								isNow={time === currentHourKey} />
						))}
					</div>
				</div>

			</div>

		</section>
	)
}