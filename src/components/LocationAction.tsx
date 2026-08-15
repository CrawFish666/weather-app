import { MapPin } from "lucide-react";
import { useWeather } from "../hooks/useWeather";



export function LocationAction() {

	const { useMyLocation } = useWeather();

	return (
		<div className="text-white relative inline-flex items-center ">
			<button onClick={useMyLocation} className="bg-gray-700 cursor-pointer flex rounded-full transition-all duration-300 ease-out items-center w-10 overflow-hidden whitespace-nowrap  hover:w-[min(96vw,100%)]">
				<div className="p-2  flex items-center outline outline-gray-950 rounded-r-3xl">
					<MapPin className="w-6 h-6" />
				</div>
				<div className="p-2">Использовать геолокацию</div>
			</button>
		</div>
	);
}