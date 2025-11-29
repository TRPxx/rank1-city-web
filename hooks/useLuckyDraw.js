import { useState, useRef, useEffect } from 'react';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

export function useLuckyDraw({ onDrawComplete }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [tapeItems, setTapeItems] = useState([]);
    const [winItem, setWinItem] = useState(null);
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [history, setHistory] = useState([]);
    const tapeRef = useRef(null);

    // Config for tape animation
    const CARD_WIDTH = 140;
    const CARD_GAP = 16;
    const WIN_INDEX = 40;

    useEffect(() => {
        const initialItems = Array(15).fill(null).map(() => getRandomItem());
        setTapeItems(initialItems);
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/luckydraw');
            const data = await res.json();
            if (data.history) setHistory(data.history);
        } catch (err) {
            console.error(err);
        }
    };

    const getRandomItem = () => {
        const items = PREREGISTER_CONFIG.luckyDraw.items;
        const rand = Math.random() * 100;
        let cumulative = 0;
        for (const item of items) {
            cumulative += item.chance;
            if (rand <= cumulative) return item;
        }
        return items[0];
    };

    const spin = async (ticketCount) => {
        if (isSpinning || ticketCount <= 0) return;
        setIsSpinning(true);
        setWinItem(null);
        setShowWinnerModal(false);

        try {
            const res = await fetch('/api/luckydraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (!data.reward) throw new Error(data.error);

            const result = data.reward;
            const newTape = [];
            for (let i = 0; i < WIN_INDEX + 5; i++) {
                newTape.push(i === WIN_INDEX ? result : getRandomItem());
            }
            setTapeItems(newTape);

            // Calculate random offset for "natural" feel
            const randomOffset = (Math.random() * 0.6 - 0.3) * CARD_WIDTH;

            setTimeout(() => {
                if (tapeRef.current) {
                    // Dynamic calculation based on current container width (Responsive!)
                    const containerWidth = tapeRef.current.parentElement.offsetWidth;
                    const itemTotalWidth = CARD_WIDTH + CARD_GAP;

                    // Calculate exact position to center the winning item
                    const targetPosition = (WIN_INDEX * itemTotalWidth) - (containerWidth / 2) + (CARD_WIDTH / 2) + randomOffset;

                    // Reset position instantly
                    tapeRef.current.style.transition = 'none';
                    tapeRef.current.style.transform = 'translateX(0px)';
                    tapeRef.current.offsetHeight; // Force reflow

                    // Start animation
                    tapeRef.current.style.transition = 'transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    tapeRef.current.style.transform = `translateX(-${targetPosition}px)`;

                    setTimeout(() => {
                        setIsSpinning(false);
                        setWinItem(result);
                        setShowWinnerModal(true);
                        fetchHistory();
                        if (onDrawComplete) onDrawComplete();
                    }, 5000);
                }
            }, 50);

        } catch (err) {
            console.error(err);
            setIsSpinning(false);
        }
    };

    return {
        isSpinning,
        tapeItems,
        winItem,
        showWinnerModal,
        setShowWinnerModal,
        history,
        tapeRef,
        spin
    };
}
