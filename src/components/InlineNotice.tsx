import type { ReactNode } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";

interface InlineNoticeProps {
	variant: "error" | "loading";
	message: string;
	title?: string;
	action?: ReactNode;
}

export function InlineNotice({
	variant,
	message,
	title,
	action,
}: InlineNoticeProps) {
	const isError = variant === "error";
	const Icon = isError ? AlertCircle : LoaderCircle;

	return (
		<div
			role={isError ? "alert" : "status"}
			className={`flex min-w-0 flex-col gap-3 rounded-xl border p-3 text-white sm:flex-row sm:items-center sm:justify-between sm:p-4 ${isError
					? "border-red-200/20 bg-red-950/70"
					: "border-white/15 bg-gray-900/60"
				}`}
		>
			<div className="flex min-w-0 items-start gap-3 sm:items-center">
				<Icon
					aria-hidden="true"
					className={`mt-0.5 h-5 w-5 shrink-0 sm:mt-0 ${isError
							? "text-red-200"
							: "animate-spin text-white/70"
						}`}
				/>
				<div className="min-w-0">
					{title && <p className="font-semibold">{title}</p>}
					<p className="wrap-break-word text-sm text-white/85">{message}</p>
				</div>
			</div>

			{action && (
				<div className="w-full sm:w-auto sm:shrink-0">
					{action}
				</div>
			)}
		</div>
	);
}