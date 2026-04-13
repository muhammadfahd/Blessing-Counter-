
import React from 'react';
import { WORLD_POPULATION } from '../constants';
import { SparklesIcon } from './icons';
import SpeechButton from './SpeechButton';

const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(3)} billion`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)} million`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
    return num.toLocaleString();
};

interface OverallSummaryProps {
  overallLuckierThan: number | null;
  isOverallLoading: boolean;
  insight: string | null;
  isInsightLoading: boolean;
}

const OverallSummary: React.FC<OverallSummaryProps> = ({ overallLuckierThan, isOverallLoading, insight, isInsightLoading }) => {
  const displayPercentage = overallLuckierThan !== null 
    ? Math.min((overallLuckierThan / WORLD_POPULATION) * 100, 100).toFixed(2)
    : '0.00';

  return (
    <div className="p-6 bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg space-y-4 shadow-sm backdrop-blur-sm">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-serif text-center">Your Blessing Summary</h2>
      
      <div className="text-center min-h-[100px] flex flex-col justify-center">
        {isOverallLoading ? (
             <div className="flex flex-col items-center justify-center animate-pulse">
                <p className="text-gray-500 dark:text-gray-400 mb-2">Calculating your overall fortune...</p>
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-4/5 mb-2"></div>
                <div className="h-10 bg-gray-400 dark:bg-gray-500 rounded w-3/5 my-1"></div>
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-4/5 mt-1"></div>
            </div>
        ) : (
            overallLuckierThan !== null && (
                <>
                    <p className="text-gray-600 dark:text-gray-400">In total, you are luckier than an estimated</p>
                    <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 my-1">{formatNumber(overallLuckierThan)} people</p>
                    <p className="text-md text-gray-600 dark:text-gray-400">That's more fortunate than <span className="font-bold">{displayPercentage}%</span> of the world's population.</p>
                </>
            )
        )}
      </div>

      {(insight || isInsightLoading) && (
        <div className="pt-4 mt-4 border-t border-blue-200 dark:border-blue-800/50">
            {isInsightLoading ? (
                <div className="animate-pulse flex items-center gap-3 justify-center">
                    <SparklesIcon className="w-5 h-5 text-yellow-400 dark:text-yellow-500 flex-shrink-0" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
            ) : (
                insight && (
                    <div className="flex flex-col gap-3 text-yellow-800 dark:text-yellow-200 bg-yellow-100/70 dark:bg-yellow-900/30 p-4 rounded-xl relative group border border-yellow-200 dark:border-yellow-800/20">
                         <div className="flex items-start gap-3">
                            <SparklesIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm italic leading-relaxed pr-10">
                                <span className="font-semibold not-italic">Personalized Insight:</span> {insight}
                            </p>
                            <div className="absolute top-4 right-4">
                                <SpeechButton text={insight} />
                            </div>
                         </div>
                    </div>
                )
            )}
        </div>
      )}
    </div>
  );
};

export default OverallSummary;
