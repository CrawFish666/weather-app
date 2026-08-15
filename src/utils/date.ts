export function formatDayMonthWeekday(dateStr: string): string {
	// dateStr в формате "YYYY-MM-DD"
	const [year, month, day] = dateStr.split("-").map(Number);

	// Локальная дата без часового пояса, чтобы избежать сдвига дня при UTC-конвертации
	const date = new Date(year, month - 1, day);

	return new Intl.DateTimeFormat("ru-RU", {
		weekday: "long",
		day: "numeric",
		month: "long",
	}).format(date);
}

export function getCurrentHourKey(timezone: string): string {
	const formatter = new Intl.DateTimeFormat("en-CA", {
		timeZone: timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		hour12: false,
	});

	const parts = formatter.formatToParts(new Date());
	const map: Record<string, string> = {};
	parts.forEach(p => { map[p.type] = p.value; });

	const hour = map.hour === "24" ? "00" : map.hour;

	return `${map.year}-${map.month}-${map.day}T${hour}:00`;
}