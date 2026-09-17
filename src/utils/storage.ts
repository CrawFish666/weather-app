export function getFromLocalStorage<T>(key: string, fallback: T): T {
	const item = localStorage.getItem(key);

	if (!item) return fallback;

	try {
		return JSON.parse(item) as T;
	} catch {
		return fallback;
	}
}

export function saveToLocalStorage<T>(key: string, data: T): void {
	localStorage.setItem(key, JSON.stringify(data));
}

export function removeFromLocalStorage(key: string): void {
	localStorage.removeItem(key);
}