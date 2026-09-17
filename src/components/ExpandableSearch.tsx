import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { City } from "../types/geocoding";
import { useWeather } from "../hooks/useWeather";



export function ExpandableSearch() {
	const { searchCities, selectCity } = useWeather();

	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [cities, setCities] = useState<City[] | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	function handleOpen() {
		setIsOpen(true);
		setQuery("");
	}

	function handleClose() {
		setIsOpen(false);
		setQuery("");
	}


	const handleSelect = async (city: City) => {
		try {
			await selectCity(city);

			setIsOpen(false);
			setQuery("");
			setCities([]);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		if (isOpen) {
			inputRef.current?.focus();
		}
	}, [isOpen]);

	useEffect(() => {

		const trimmedQuery = query.trim();

		if (trimmedQuery.length <= 2) {
			setCities(null);
			setIsLoading(false);
			return;
		}

		const controller = new AbortController();

		const timeoutId = setTimeout(async () => {
			try {
				setIsLoading(true);

				const data = await searchCities(trimmedQuery, controller.signal);

				setCities(data);
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError") {
					return;
				}

				console.error(error);
			} finally {
				setIsLoading(false)
			}
		}, 500);

		return () => {
			clearTimeout(timeoutId);
			controller.abort();
		}

	}, [query, searchCities])

	return (
		<div className={`bg-gray-600 cursor-pointer inline-flex flex-row-reverse  ${isLoading || cities ? "rounded-t-2xl" : "rounded-full"} transition-[width] duration-300 ease-out items-center overflow-hidden whitespace-nowrap ${isOpen ? "w-[min(96vw,400px)]" : "w-10"}`}>
			<button
				onClick={isOpen ? handleClose : handleOpen}
				className="p-2 flex items-center z-10">
				{isOpen ? <X className="w-6 h-6 text-white" /> : <Search className="w-6 h-6 text-white" />}
			</button>
			<input className={`focus:outline-none placeholder:text-white overflow-hidden  w-full h-10  text-white py-2 px-6`}
				placeholder="Введите город..."
				ref={inputRef} value={query}
				onChange={(e) => setQuery(e.target.value)} />
			{isOpen && (
				<ul className="text-white absolute left-0 top-full w-full overflow-hidden rounded-b-2xl">
					{isLoading && (
						<li className="bg-gray-600 p-3">
							<span className="inline-block animate-pulse text-white">
								Загрузка...
							</span>
						</li>
					)}

					{!isLoading && cities !== null && cities.length === 0 && (
						<li className="bg-gray-600 p-3 text-white cursor-default">Не удалось найти город...</li>
					)}

					{!isLoading && cities && (
						cities.map(city => (
							<li key={city.id} className="overflow-hidden">
								<button onClick={() => handleSelect(city)} type="button" className="w-full bg-gray-600 p-3 text-left text-white hover:bg-gray-700 cursor-pointer">
									{city.name}, {city?.state}, {city?.country}
								</button>
							</li>
						))
					)}

				</ul>

			)}
		</div>

	);
}