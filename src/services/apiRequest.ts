export type ApiFailureKind =
	| "timeout"
	| "http"
	| "network"
	| "invalid-response";

const REQUEST_TIMEOUT_MS = 10_000;

export class ApiRequestError extends Error {
	readonly kind: ApiFailureKind;
	readonly status?: number;

	constructor(kind: ApiFailureKind, status?: number) {
		super(kind === "http" ? `API returned HTTP ${status}` : `API request failed: ${kind}`);
		this.name = "ApiRequestError";
		this.kind = kind;
		this.status = status;
	}
}

export function getApiErrorMessage(error: unknown, apiName: string): string {
	if (!(error instanceof ApiRequestError)) {
		return `Не удалось получить ответ от ${apiName}.`;
	}

	switch (error.kind) {
		case "timeout":
			return `${apiName} не ответил за 10 секунд. Проверьте подключение; возможно, API недоступен в вашей сети или регионе.`;

		case "http":
			if (error.status === 503) {
				return `${apiName} временно недоступен (503). Попробуйте позже.`;
			}
			return `${apiName} ответил с ошибкой HTTP ${error.status ?? "неизвестно"}.`;

		case "network":
			return `Не удалось связаться с ${apiName}. Проверьте подключение; возможно, доступ ограничен в вашей сети или регионе.`;

		case "invalid-response":
			return `${apiName} вернул некорректный ответ.`;
	}
}



export async function fetchJson<T>(
	input: RequestInfo | URL,
	init: RequestInit = {},
): Promise<T> {
	const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
	const signal = init.signal
		? AbortSignal.any([init.signal, timeoutSignal])
		: timeoutSignal;

	try {
		const response = await fetch(input, { ...init, signal });

		if (!response.ok) {
			throw new ApiRequestError("http", response.status);
		}

		try {
			return (await response.json()) as T;
		} catch (error) {
			if (init.signal?.aborted) throw error;
			if (timeoutSignal.aborted) {
				throw new ApiRequestError("timeout");
			}

			throw new ApiRequestError("invalid-response");
		}
	} catch (error) {
		if (error instanceof ApiRequestError) throw error;
		if (init.signal?.aborted) throw error;
		if (timeoutSignal.aborted) throw new ApiRequestError("timeout");
		if (error instanceof TypeError) throw new ApiRequestError("network");

		throw error;
	}
}