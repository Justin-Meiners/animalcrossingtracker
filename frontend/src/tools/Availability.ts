import { type TimeWindow } from "./../types/Critter.ts"

function isAvailableNow(timesByMonth: Record<string, TimeWindow | null>): boolean {
    const now = new Date();
    const currentMonth = (now.getMonth() + 1).toString();
    const currentHour = now.getHours();

    const window = timesByMonth[currentMonth];
    if (!window) {
        return false;
    }

    if (window.start <= window.end) {
        return currentHour >= window.start && currentHour < window.end;
    } else {
        return currentHour >= window.start || currentHour < window.end;
    }
}

export { isAvailableNow };