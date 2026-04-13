
import React from 'react';
import { Achievement } from '../types';

interface BadgeProps {
    achievement: Achievement;
    isUnlocked: boolean;
}

const Badge: React.FC<BadgeProps> = ({ achievement, isUnlocked }) => {
    const Icon = achievement.icon;

    return (
        <div
            className={`flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-500 transform ${
                isUnlocked
                ? 'bg-gradient-to-b from-yellow-50 to-white border-yellow-200 dark:from-yellow-900/20 dark:to-gray-800 dark:border-yellow-700/50 shadow-lg scale-100 opacity-100'
                : 'bg-gray-50/50 border-gray-100 dark:bg-gray-800/40 dark:border-gray-700/30 scale-95 opacity-60 grayscale'
            }`}
            title={isUnlocked ? `Unlocked: ${achievement.description}`: achievement.description}
        >
            <div
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 shadow-inner ${
                    isUnlocked
                    ? 'bg-yellow-400 animate-badge-pop'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
            >
                <Icon className={`w-10 h-10 ${isUnlocked ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
            </div>
            <p className={`mt-4 font-black text-xs uppercase tracking-widest ${isUnlocked ? 'text-yellow-800 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-600'}`}>
                {achievement.name}
            </p>
            <p className={`text-[10px] leading-tight mt-1 px-2 ${isUnlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600 italic'}`}>
                {isUnlocked ? achievement.description : 'Requirement hidden'}
            </p>
            
            <style>{`
                @keyframes badge-pop {
                    0% { transform: scale(0.8); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                .animate-badge-pop {
                    animation: badge-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
            `}</style>
        </div>
    );
};

export default Badge;
