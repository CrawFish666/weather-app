import { LocationAction } from "../components/LocationAction";
import sunLogo from "../assets/sunLogo.webp"
import { ExpandableSearch } from "../components/ExpandableSearch";
import { useWeather } from "../hooks/useWeather";
import { RotateCw } from "lucide-react";
import { InlineNotice } from "../components/InlineNotice";
import { useState } from "react";

export function WelcomePage() {

	const { weatherError, retryWeather } = useWeather();
	const [isRetrying, setIsRetrying] = useState(false);
	
	async function handleRetry() {
		setIsRetrying(true);
		try {
			await retryWeather();
		} finally {
			setIsRetrying(false);
		}
	}

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

			<main className="max-w-96 md:max-w-2xl w-full mx-auto px-2 flex items-center justify-center">
				<div className="flex flex-col items-center w-full">
					<div className="max-w-72 self-center">
						<img src={sunLogo} className="object-contain" fetchPriority="high" alt="sun" />
					</div>
					
					<div className="text-center flex flex-col gap-5 text-white">
						<h1>Добро пожаловать</h1>
						<p>Разрешите доступ к геолокации или найдите город вручную</p>
						
					</div>
					{(weatherError || isRetrying) && (
						<InlineNotice
							variant={isRetrying ? "loading" : "error"}
							title={
								isRetrying
									? "Загружаем погоду"
									: "Не удалось загрузить погоду"
							}
							message={
								isRetrying
									? "Ожидаем ответ сервиса."
									: weatherError ?? ""
							}
							action={
								<button
									type="button"
									onClick={() => void handleRetry()}
									disabled={isRetrying}
									className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
								>
									{!isRetrying && <RotateCw className="h-4 w-4" />}
									{isRetrying ? "Загружаем..." : "Повторить"}
								</button>
							}
						/>
					)}
				</div>
			</main>
		</>
	)
}