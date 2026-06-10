interface TimeWindow {
    start: number;
    end: number;
}

function isAvailableNow(timesByMonth: Record<string, TimeWindow | null>): boolean {
    const now = new Date();
    const currentMonth = (now.getMonth() + 1).toString();
    const currentHour = now.getHours();

    const window = timesByMonth[currentMonth];
    if (!window) {
        return false; // Not available this month
    }

    if (window.start <= window.end) {
        // Normal case: e.g., 9am to 5pm
        return currentHour >= window.start && currentHour < window.end;
    } else {
        // Overnight case: e.g., 9pm to 4am
        return currentHour >= window.start || currentHour < window.end;
    }
}

export { isAvailableNow };