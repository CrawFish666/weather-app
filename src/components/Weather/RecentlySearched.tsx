// import type { City } from "../../types/geocoding";
// import { RecentSearchCard } from "./RecentSearchCard";
// import { getCityKey } from "../../utils/city";
import useEmblaCarousel from 'embla-carousel-react'
import { useWeather } from "../../hooks/useWeather";
import { RecentlySearchedCard } from './RecentlySearchedCard';
import { RecentlySearchedCardSkeleton } from "../Skeletons/weather/RecentlySearchedCardSkeleton";
import { getCityKey } from '../../utils/city';



export function RecentlySearched() {

	const [emblaRef] = useEmblaCarousel({
		loop: false,
		align: "start",
		dragFree: false,
		slidesToScroll: 1,
		// startIndex: 5,
		containScroll: false,
		skipSnaps: true,
		// dragThreshold: 25,
		duration: 40
	})

	const { recentCities, recentCitiesWeather, isLoadingRecentWeather } = useWeather();

	return (
		<section className="">

			<div>
				<div>
					<h2 className="mb-4 text-lg font-semibold text-gray-400/80">Recently Searched</h2>
				</div>

				<div className="embla">
					<div className="embla__viewport overflow-hidden" ref={emblaRef}>
						<div className="embla__container flex touch-pan-y touch-pinch-zoom gap-4">
							{isLoadingRecentWeather && recentCities.map((_, index) => (
								<RecentlySearchedCardSkeleton key={index} />
							))}

							{!isLoadingRecentWeather && recentCities && recentCities.map(item => (
								<RecentlySearchedCard key={item.id} city={item} data={recentCitiesWeather[getCityKey(item)]} />
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}