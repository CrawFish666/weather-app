import { Skeleton } from "../Skeleton";

export function CurrentTemperatureSkeleton() {
	return (
		<section className=" animate-pulse">
			<div className="flex gap-5 items-center">
				<div className="flex gap-2 items-start">
					<Skeleton className="h-24 w-36" />

				</div>

				<div className="flex flex-col gap-2">
					<div className="bg-white/10 py-1 h-8 px-5 rounded-full flex items-center gap-5 min-w-28">

					</div>

					<div className="bg-white/10 py-1 h-8 px-5 rounded-full flex items-center gap-5 min-w-28">


					</div>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Skeleton className="w-12 h-12 rounded-full" />
				<Skeleton className="h-7 w-28" />
			</div>
		</section>
	);
}