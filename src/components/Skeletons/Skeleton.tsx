interface SkeletonProps {
	className?: string;
	rounded?: "sm" | "md" | "lg" | "full" | "xl" | "2xl";
}

const roundedMap = {
	sm: "rounded-sm",
	md: "rounded-md",
	lg: "rounded-lg",
	xl: "rounded-xl",
	'2xl': "rounded-2xl",
	full: "rounded-full"
};

export function Skeleton({ className = "", rounded = "md" }: SkeletonProps) {
	return (
		<div className={`animate-pulse bg-white/15 ${className} ${roundedMap[rounded]}`} />
	)
}