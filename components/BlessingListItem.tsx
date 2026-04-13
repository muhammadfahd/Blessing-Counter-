
import React, { useState } from 'react';
import { Blessing } from '../types';
import { WORLD_POPULATION, CHART_COLORS } from '../constants';
import { CheckCircleIcon, LightBulbIcon, SparklesIcon, LoaderIcon } from './icons';
import SpeechButton from './SpeechButton';

interface BlessingListItemProps {
  blessing: Blessing;
  index: number;
  onGenerateImage?: (id: number) => void;
}

const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(3)} billion`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)} million`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
    return num.toLocaleString();
};


const BlessingListItem: React.FC<BlessingListItemProps> = ({ blessing, index, onGenerateImage }) => {
    const [showFact, setShowFact] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const percentage = ((blessing.count / WORLD_POPULATION) * 100).toFixed(2);
    const color = CHART_COLORS[index % CHART_COLORS.length];

    const handleGenerate = async () => {
        if (!onGenerateImage) return;
        setIsGenerating(true);
        await onGenerateImage(blessing.id);
        setIsGenerating(false);
    };

    return (
        <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-gray-700/50 p-5 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-all animate-fade-in-up">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                    <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: color }} aria-hidden="true"></div>
                    <div>
                        <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg leading-tight">{blessing.text}</p>
                        {blessing.villageStat && (
                            <p className="text-xs font-bold text-blue-500 dark:text-blue-400 mt-1 uppercase tracking-wider">
                                🏠 {blessing.villageStat}
                            </p>
                        )}
                    </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-black text-blue-600 dark:text-blue-400 text-xl leading-none">
                        {formatNumber(blessing.count)}
                    </p>
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                        Luckier Than
                    </p>
                </div>
            </div>

            {blessing.imageUrl && (
                <div className="relative rounded-xl overflow-hidden aspect-video shadow-inner group">
                    <img src={blessing.imageUrl} alt={blessing.text} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white text-xs font-medium italic">"{blessing.text}"</p>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-3 mt-1">
                {blessing.perspectiveFact && (
                    <button 
                        onClick={() => setShowFact(!showFact)}
                        className="flex items-center gap-1.5 text-[10px] font-black text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors uppercase tracking-[0.15em] border border-yellow-200 dark:border-yellow-900/50 px-2 py-1 rounded-md"
                    >
                        <LightBulbIcon className="w-3 h-3" />
                        {showFact ? 'Hide Context' : 'Perspective'}
                    </button>
                )}
                
                {!blessing.imageUrl && onGenerateImage && (
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-1.5 text-[10px] font-black text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors uppercase tracking-[0.15em] border border-purple-200 dark:border-purple-900/50 px-2 py-1 rounded-md disabled:opacity-50"
                    >
                        {isGenerating ? <LoaderIcon className="w-3 h-3 animate-spin" /> : <SparklesIcon className="w-3 h-3" />}
                        {isGenerating ? 'Painting...' : 'AI Postcard'}
                    </button>
                )}
            </div>

            {showFact && blessing.perspectiveFact && (
                <div className="p-4 bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/20 rounded-xl animate-slide-down flex items-start gap-3">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200 italic leading-relaxed flex-1">
                        {blessing.perspectiveFact}
                    </p>
                    <SpeechButton text={blessing.perspectiveFact} size="sm" className="bg-yellow-200/50 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300" />
                </div>
            )}
            
            <style>{`
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-down { animation: slide-down 0.2s ease-out; }
            `}</style>
        </div>
    );
};

export default BlessingListItem;
