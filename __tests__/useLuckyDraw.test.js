import { renderHook, act, waitFor } from '@testing-library/react';
import { useLuckyDraw } from '@/hooks/useLuckyDraw';

// Mock fetch
global.fetch = jest.fn();

describe('useLuckyDraw', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('initializes with default state', async () => {
        // Mock fetch response for initial history load
        fetch.mockResolvedValueOnce({
            json: async () => ({ history: [] }),
        });

        const { result } = renderHook(() => useLuckyDraw({}));

        expect(result.current.isSpinning).toBe(false);
        expect(result.current.tapeItems).toHaveLength(15);
        expect(result.current.winItem).toBeNull();

        // Wait for the effect to finish to avoid act warning
        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });
    });

    it('fetches history on mount', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ history: [{ id: 1, reward_name: 'Test Item' }] }),
        });

        const { result } = renderHook(() => useLuckyDraw({}));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/luckydraw');
        });
    });
});
