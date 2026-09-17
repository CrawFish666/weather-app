import { ExpandableSearch } from "../components/ExpandableSearch";
import { LocationAction } from "../components/LocationAction";


import { CityHeader } from "../components/Weather/CityHeader";
import { CurrentTemperature } from "../components/Weather/CurrentTemperature";

import { HourlyForecasts } from "../components/Weather/HourlyForecasts";
import { RecentlySearched } from "../components/Weather/RecentlySearched";


export function WeatherPage() {

	return (
		<>
			<header className="max-w-7xl w-full mx-auto px-2 md:px-12 flex flex-col gap-10 py-4">
				<div className="relative flex justify-center items-center">
					<div className="absolute left-0 z-1 top-1/2 -translate-y-1/2">
						<LocationAction />
					</div>
					<div className="flex items-center">
						<span className="text-red-800 text-center relative -top-1 text-[clamp(3rem,8vw,3.75rem)] font-bold leading-none [-webkit-text-stroke:1px_black]">W</span>
						<span className="text-white text-[clamp(1.5rem,8vw,2.25rem)] leading-none font-medium">eather App</span>
					</div>
					<div className="absolute right-0 z-1 top-1/2 -translate-y-1/2">
						<ExpandableSearch />
					</div>
				</div>
			</header>
			<main className="">
				<div className="max-w-7xl m-auto px-2 md:px-12 flex flex-col gap-10 py-6">

					<CityHeader />

					<CurrentTemperature />

					<RecentlySearched />

					<HourlyForecasts />

				</div>
			</main>
		</>
	)
}