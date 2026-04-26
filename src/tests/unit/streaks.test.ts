import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '../../lib/streaks';

/* MENTOR_TRACE_STAGE3_HABIT_A91 */

describe('calculateCurrentStreak', () => {
    it('returns 0 when completions is empty', () => {
        expect(calculateCurrentStreak([], '2026-04-26')).toBe(0);
    });

    it('returns 0 when today is not completed', () => {
        expect(calculateCurrentStreak(['2026-04-25'], '2026-04-26')).toBe(0);
    });

    it('returns the correct streak for consecutive completed days', () => {
        const days = ['2026-04-26', '2026-04-25', '2026-04-24'];
        expect(calculateCurrentStreak(days, '2026-04-26')).toBe(3);
    });

    it('ignores duplicate completion dates', () => {
        const days = ['2026-04-26', '2026-04-26', '2026-04-25'];
        expect(calculateCurrentStreak(days, '2026-04-26')).toBe(2);
    });

    it('breaks the streak when a calendar day is missing', () => {
        const days = ['2026-04-26', '2026-04-24']; // Missing the 25th
        expect(calculateCurrentStreak(days, '2026-04-26')).toBe(1);
    });
});