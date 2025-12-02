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
    const CARD_WIDTH = 130; // Match actual card width in LuckyDraw.js (130px base, sm:140px)
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
        const totalChance = items.reduce((sum, item) => sum + item.chance, 0);
        let random = Math.random() * totalChance;
        let selectedItem = items[items.length - 1];

        for (const item of items) {
            if (random < item.chance) {
                selectedItem = item;
                break;
            }
            random -= item.chance;
        }
        return selectedItem;
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

            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                setTimeout(() => {
                    if (tapeRef.current) {
                        // Get actual card width and gap from DOM for accuracy
                        const cards = tapeRef.current.querySelectorAll('div');
                        const firstCard = cards[0];
                        const secondCard = cards[1];

                        if (!firstCard || !secondCard) {
                            console.error('Cards not found in DOM');
                            return;
                        }

                        const actualCardWidth = firstCard.offsetWidth;

                        // Calculate actual gap by measuring distance between cards
                        const firstCardRight = firstCard.offsetLeft + firstCard.offsetWidth;
                        const secondCardLeft = secondCard.offsetLeft;
                        const actualGap = secondCardLeft - firstCardRight;

                        // Dynamic calculation based on current container width (Responsive!)
                        const containerWidth = tapeRef.current.parentElement.offsetWidth;
                        const itemTotalWidth = actualCardWidth + actualGap;

                        // Calculate exact position to center the winning item
                        const randomOffset = 0; // Temporarily disabled for testing - (Math.random() * 0.6 - 0.3) * actualCardWidth;
                        const targetPosition = (WIN_INDEX * itemTotalWidth) - (containerWidth / 2) + (actualCardWidth / 2) + randomOffset;

                        console.log('🎯 Lucky Draw Debug:', {
                            resultItem: result.name,
                            winIndex: WIN_INDEX,
                            actualCardWidth,
                            actualGap,
                            expectedGap: CARD_GAP,
                            containerWidth,
                            itemTotalWidth,
                            randomOffset,
                            targetPosition,
                            firstCardLeft: firstCard.offsetLeft,
                            firstCardRight,
                            secondCardLeft
                        });

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
                }, 100);
            });

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
