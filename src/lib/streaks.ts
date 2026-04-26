export function calculateCurrentStreak(completions: string[], today?: string): number {

    if (completions.length === 0 || !today) return 0;

    //  Remove duplicates and sort descending (newest first)
    const uniqueDates = Array.from(new Set(completions)).sort().reverse();

    // If today isn't in the list, the streak is 0 per requirements
    if (!uniqueDates.includes(today)) return 0;

    let streak = 0;
    let currentDate = new Date(today);

    //  Count backwards
    while (true) {
        const dateString = currentDate.toISOString().split('T')[0];

        if (uniqueDates.includes(dateString)) {
            streak++;
            // Move to the previous calendar day
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}