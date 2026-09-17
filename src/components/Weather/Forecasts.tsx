import { useState } from "react";
import { HourlyForecasts } from "./HourlyForecasts";
import { DailyForecasts } from "./DailyForecasts";

type ForecastType = "hourly" | "daily";

export function Forecasts() {
	const [forecastType, setForecastType] = useState<ForecastType>("hourly");

	return (
		<section>
			<div className="mb-4 flex gap-2">
				<button
					type="button"
					onClick={() => setForecastType("hourly")}
					className={`rounded-xl px-4 py-2 text-lg transition
            ${forecastType === "hourly"
							? "bg-gray-500/70 text-white cursor-default"
							: "bg-gray-500/20 text-gray-400 cursor-pointer"
						}`}>
					По часам
				</button>

				<button
					type="button"
					onClick={() => setForecastType("daily")}
					className={`rounded-xl px-4 py-2 text-lg transition
            ${forecastType === "daily"
							? "bg-gray-500/70 text-white cursor-default"
							: "bg-gray-500/20 text-gray-400 cursor-pointer"
						}`}>
					По дням
				</button>
			</div>

			{forecastType === "hourly" ? (
				<HourlyForecasts />
			) : (
				<DailyForecasts />
			)}
		</section>
	);
}