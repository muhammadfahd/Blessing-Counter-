
import React, { useState, useEffect } from 'react';

const GLOBAL_BLESSINGS = [
    "Someone just counted: 'I can breathe clearly today'",
    "A person in France is grateful for clean tap water",
    "Someone in Brazil is thankful for their grandmother's health",
    "A user just added: 'I finished a difficult book'",
    "Perspective Shift: 1 in 3 people worldwide don't have access to safe drinking water.",
    "Someone is grateful for: 'A quiet morning walk'",
    "Perspective Shift: 2.3 billion people lack basic handwashing facilities at home.",
];

const GlobalPulse: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % GLOBAL_BLESSINGS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-blue-600/10 dark:bg-blue-400/5 border-y border-blue-100 dark:border-blue-900/30 overflow-hidden h-10 flex items-center relative rounded-lg">
            <div className="absolute left-0 bg-gradient-to-r from-blue-50 dark:from-gray-900 to-transparent w-10 h-full z-10"></div>
            <div className="absolute right-0 bg-gradient-to-l from-blue-50 dark:from-gray-900 to-transparent w-10 h-full z-10"></div>
            
            <div className="flex items-center gap-4 whitespace-nowrap animate-marquee px-4">
                <span className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    GLOBAL PULSE:
                </span>
                <span key={currentIndex} className="text-xs text-gray-600 dark:text-gray-400 font-medium animate-pulse-fade">
                    {GLOBAL_BLESSINGS[currentIndex]}
                </span>
            </div>

            <style>{`
                @keyframes pulse-fade {
                    0% { opacity: 0; transform: translateY(5px); }
                    10% { opacity: 1; transform: translateY(0); }
                    90% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-5px); }
                }
                .animate-pulse-fade {
                    animation: pulse-fade 5s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default GlobalPulse;
