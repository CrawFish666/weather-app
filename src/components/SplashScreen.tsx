import sunLogo from "../assets/sunLogo.webp";

export function SplashScreen({message = "Загружаем приложение..."}: {message?: string}) {

	return (
		<>
			<header className="max-w-7xl w-full mx-auto px-2 md:px-12 flex flex-col gap-10 py-4">
				<div className="relative flex justify-center items-center">
					<div className="flex items-center">
						<span className="text-red-800 text-center relative -top-1 text-[clamp(3rem,8vw,3.75rem)] font-bold leading-none [-webkit-text-stroke:1px_black]">W</span>
						<span className="text-white text-[clamp(1.5rem,8vw,2.25rem)] leading-none font-medium">eather App</span>
					</div>
				</div>
			</header>

			<main className="max-w-96 md:max-w-2xl w-full mx-auto px-2 flex items-center justify-center ">
				<div className="flex flex-col items-center w-full">
					<div className="max-w-72 self-center animate-[splash_1.5s_ease-in-out_infinite]">
						<img
							src={sunLogo}
							className="object-contain"
							fetchPriority="high"
							alt="sun"
						/>
					</div>
					<p role="status" className="mt-4 text-center text-white/80">
						{message}
					</p>
				</div>
			</main>
		</>
	)
}