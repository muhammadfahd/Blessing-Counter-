
import React from 'react';
import { Blessing } from '../types';
import BlessingInputForm from '../components/BlessingInputForm';
import PredefinedBlessings from '../components/PredefinedBlessings';
import BlessingList from '../components/BlessingList';
import OverallSummary from '../components/OverallSummary';
import BlessingsChart from '../components/BlessingsChart';
import SummaryActions from '../components/SummaryActions';
import GlobalPulse from '../components/GlobalPulse';
import { SparklesIcon } from '../components/icons';

interface CounterPageProps {
    blessings: Blessing[];
    isLoading: boolean;
    error: string | null;
    personalizedInsight: string | null;
    isInsightLoading: boolean;
    overallLuckierThan: number | null;
    isOverallLoading: boolean;
    onAddBlessing: (text: string, isPredefined: boolean) => void;
    onGenerateImage: (id: number) => void;
    onClear: () => void;
}

const CounterPage: React.FC<CounterPageProps> = ({
    blessings,
    isLoading,
    error,
    personalizedInsight,
    isInsightLoading,
    overallLuckierThan,
    isOverallLoading,
    onAddBlessing,
    onGenerateImage,
    onClear,
}) => {

    const formatNumber = (num: number) => {
        if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(3)} billion`;
        if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)} million`;
        return num.toLocaleString();
    };

    const overallSummaryText = overallLuckierThan !== null 
        ? `In total, I'm luckier than an estimated ${formatNumber(overallLuckierThan)} people.`
        : "Calculating how blessed I am...";

    return (
        <>
            <header className="text-center mb-6">
                <div className="flex items-center justify-center gap-3">
                    <SparklesIcon className="w-10 h-10 text-yellow-500 animate-pulse" />
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-gray-100 font-serif tracking-tight">Blessing Counter</h1>
                    <SparklesIcon className="w-10 h-10 text-yellow-500 animate-pulse" />
                </div>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 font-medium">Quantify your gratitude. Gain perspective.</p>
            </header>

            <div className="mb-8">
                <GlobalPulse />
            </div>

            <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-6 md:p-10 space-y-8">
                <div className="space-y-4">
                    <BlessingInputForm onAddBlessing={(text) => onAddBlessing(text, false)} isLoading={isLoading} />
                    <PredefinedBlessings 
                        onAddBlessing={onAddBlessing} 
                        isLoading={isLoading} 
                        existingBlessings={blessings.map(b => b.text)} 
                    />
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium" role="alert">
                        {error}
                    </div>
                )}

                <BlessingList 
                    blessings={blessings} 
                    isLoading={isLoading} 
                    onGenerateImage={onGenerateImage}
                />

                {blessings.length > 0 && (
                    <div className="pt-10 border-t border-gray-100 dark:border-gray-700/50 space-y-10">
                        <OverallSummary 
                            overallLuckierThan={overallLuckierThan}
                            isOverallLoading={isOverallLoading}
                            insight={personalizedInsight} 
                            isInsightLoading={isInsightLoading} 
                        />
                        <BlessingsChart blessings={blessings} />
                        <SummaryActions 
                            blessings={blessings} 
                            onClear={onClear}
                            overallSummaryText={overallSummaryText}
                            personalizedInsight={personalizedInsight}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default CounterPage;
