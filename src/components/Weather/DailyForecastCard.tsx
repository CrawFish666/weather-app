import { formatForecastDate } from "../../utils/date";
import { getWeatherIcon } from "../../utils/weatherCode";

interface DailyForecastCardProps {
	date: string;
	weatherCode: number;
	temperatureMin: number;
	temperatureMax: number;
	precipitationSum: number;
	tempUnitMin: string;
	tempUnitMax: string;
	isNow: boolean;
}

export function DailyForecastCard({
	date,
	weatherCode,
	temperatureMin,
	temperatureMax,
	precipitationSum,
	tempUnitMin,
	tempUnitMax,
	isNow }: DailyForecastCardProps) {
	const { iconUrl, label } = getWeatherIcon(weatherCode);

	return (
		<div className={`flex flex-[0_0_150px] min-w-0 shrink-0 flex-col items-center gap-2 rounded-2xl bg-gray-500/20 p-4 select-none ${isNow && "bg-gray-500/70"}`}>
			
			<span className="text-xl text-gray-300">
				{formatForecastDate(date)}
			</span>
			<img
				title={label}
				src={iconUrl}
				alt={label}
				className="h-16 w-16"
				loading="lazy"
			/>
			<span className="text-center flex-1 wrap-anywhere text-gray-300/80">
				{label}
			</span>
			<div className="flex gap-2">
				<div>
					<span className="text-lg font-medium text-gray-300">
						{temperatureMax.toFixed(0)}
					</span>
					<span className="text-xs text-gray-400/80 align-top relative top-1">
						{tempUnitMax}
					</span>
				</div>
				<div>
					<span className="text-lg font-medium text-gray-400">
						{temperatureMin.toFixed(0)}
					</span>
					<span className="text-xs text-gray-400/80 align-top relative top-1">
						{tempUnitMin}
					</span>
				</div>
			</div>
			<span className="text-sm text-gray-400">
				Осадки: {precipitationSum} мм
			</span>
		</div>
	);
}