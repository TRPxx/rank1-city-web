'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket, Terminal, Cpu, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

export default function LuckyDrawCyberpunk({ ticketCount = 10, onDrawComplete }) {
    const [status, setStatus] = useState('idle'); // idle, hacking, decoding, success
    const [displayText, setDisplayText] = useState('');
    const [reward, setReward] = useState(null);
    const [logs, setLogs] = useState([]);
    const canvasRef = useRef(null);

    // Matrix Rain Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        const chars = '0123456789ABCDEF';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);
        return () => clearInterval(interval);
    }, []);

    const addLog = (text) => {
        setLogs(prev => [...prev.slice(-4), `> ${text}`]);
    };

    const handleHack = () => {
        if (ticketCount <= 0 || status !== 'idle') return;

        setStatus('hacking');
        setLogs([]);
        addLog('INITIATING SEQUENCE...');

        setTimeout(() => addLog('BYPASSING FIREWALL...'), 500);
        setTimeout(() => addLog('ACCESSING MAINFRAME...'), 1200);
        setTimeout(() => addLog('DECRYPTING REWARD DATA...'), 2000);

        // Simulate API
        setTimeout(() => {
            // Get Reward
            const items = PREREGISTER_CONFIG.luckyDraw.items;
            const rand = Math.random() * 100;
            let cumulative = 0;
            let result = items[0];
            for (const item of items) {
                cumulative += item.chance;
                if (rand <= cumulative) {
                    result = item;
                    break;
                }
            }
            setReward(result);
            setStatus('decoding');

            // Decoding Effect
            let iterations = 0;
            const targetText = result.name;
            const interval = setInterval(() => {
                setDisplayText(targetText
                    .split('')
                    .map((char, index) => {
                        if (index < iterations) return char;
                        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
                    })
                    .join('')
                );

                if (iterations >= targetText.length) {
                    clearInterval(interval);
                    setStatus('success');
                    addLog('DECRYPTION COMPLETE.');
                    if (onDrawComplete) onDrawComplete(result);
                }
                iterations += 1 / 3; // Speed of decoding
            }, 30);

        }, 3000);
    };

    const reset = () => {
        setStatus('idle');
        setReward(null);
        setDisplayText('');
        setLogs([]);
    };

    return (
        <div className="w-full max-w-4xl mx-auto min-h-[600px] relative bg-black border border-green-500/30 rounded-lg overflow-hidden font-mono shadow-[0_0_50px_rgba(0,255,0,0.1)]">

            {/* Matrix Background */}
            <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />

            {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center p-8">

                {/* Header */}
                <div className="absolute top-6 left-6 flex items-center gap-2 text-green-500">
                    <Terminal className="w-5 h-5" />
                    <span className="text-sm tracking-widest">SYSTEM_V.2.0.4</span>
                </div>

                <div className="absolute top-6 right-6 text-green-500/50 text-xs">
                    SECURE CONNECTION
                </div>

                {/* Center Stage */}
                <div className="w-full max-w-lg text-center space-y-8">

                    {/* Status Display */}
                    <div className="h-48 flex flex-col items-center justify-center border-2 border-green-500/30 bg-black/50 backdrop-blur rounded-lg p-6 relative overflow-hidden group">
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500" />

                        {status === 'idle' && (
                            <div className="animate-pulse text-green-500">
                                <Cpu className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-xl tracking-widest">READY_TO_HACK</p>
                            </div>
                        )}

                        {status === 'hacking' && (
                            <div className="text-green-400 w-full">
                                <div className="w-full bg-green-900/20 h-2 mb-4 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-green-500"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, ease: "linear" }}
                                    />
                                </div>
                                <div className="text-left font-mono text-xs space-y-1 h-24 overflow-hidden">
                                    {logs.map((log, i) => (
                                        <p key={i} className="text-green-400/80">{log}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(status === 'decoding' || status === 'success') && (
                            <div className="space-y-4">
                                <div className="text-4xl md:text-5xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)] break-words">
                                    {displayText}
                                </div>
                                {status === 'success' && reward && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <Badge variant="outline" className="border-green-500 text-green-500 bg-green-500/10">
                                            {reward.rarity}
                                        </Badge>
                                        <ShieldCheck className="w-4 h-4 text-green-500" />
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center gap-4">
                        {status === 'success' ? (
                            <Button
                                onClick={reset}
                                className="w-full h-14 bg-green-600 hover:bg-green-500 text-black font-bold text-lg tracking-widest border border-green-400"
                            >
                                REBOOT_SYSTEM
                            </Button>
                        ) : (
                            <Button
                                onClick={handleHack}
                                disabled={status !== 'idle' || ticketCount <= 0}
                                className={`w-full h-14 text-lg font-bold tracking-widest transition-all ${status === 'idle'
                                        ? 'bg-green-600 hover:bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                                        : 'bg-green-900/20 text-green-500/50 border border-green-900'
                                    }`}
                            >
                                {status === 'idle' ? 'EXECUTE_HACK()' : 'PROCESSING...'}
                            </Button>
                        )}

                        <div className="flex items-center gap-2 text-green-500/70 text-sm">
                            <Ticket className="w-4 h-4" />
                            <span>AVAILABLE_KEYS: {ticketCount}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
