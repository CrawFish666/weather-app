import { Skeleton } from "../Skeleton";

export function CityHeaderSkeleton() {
	return (
		<section className="flex items-start gap-1">
			<Skeleton className="w-5 h-5" rounded="full" />
			<div className="flex flex-col gap-1">
				<Skeleton className="h-4 w-44" />
				<Skeleton className="h-4 w-32 opacity-70" />
			</div>
		</section>
	)
}