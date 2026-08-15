import { getWeatherIcon } from "../../utils/weatherCode";

interface HourlyForecastCardProps {
	time: string;
	weatherCode: number;
	temperature: number;
	tempUnit: string;
	isNow: boolean;
}

export function HourlyForecastCard({ time, weatherCode, temperature, tempUnit, isNow }: HourlyForecastCardProps) {
	const { iconUrl, label } = getWeatherIcon(weatherCode);

	return (
		<div className={`flex flex-[0_0_150px] min-w-0 shrink-0 flex-col items-center gap-2 rounded-2xl bg-gray-500/20 p-4 select-none ${isNow && "bg-gray-500/70"}`}>
			<span className={`text-xl text-gray-300 `}>{isNow ? "Now" : time.slice(11, 16)}</span>
			<img title={label} src={iconUrl} alt={label} className="h-16 w-16" loading="lazy" />
			<span className="text-center flex-1 wrap-anywhere text-gray-300/80">{label}</span>
			<div>
				<span className="text-lg font-medium text-gray-300">{temperature.toFixed(0)}</span>
				<span className="text-xs text-gray-400/80 align-top relative top-1 left-0">{tempUnit}</span>
			</div>
		</div>
	);
}