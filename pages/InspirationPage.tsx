
import React from 'react';
import { LightBulbIcon, QuoteIcon, LoaderIcon } from '../components/icons';
import SpeechButton from '../components/SpeechButton';

interface InspirationPageProps {
    challenge: string;
    quote: string;
    isLoading: boolean;
    onNewInspiration: () => void;
}

const InspirationPage: React.FC<InspirationPageProps> = ({ challenge, quote, isLoading, onNewInspiration }) => {
    return (
        <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-6 md:p-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 font-serif text-center mb-8">Daily Inspiration</h1>
            <div className="space-y-6 max-w-xl mx-auto">
                <div className="space-y-8 p-8 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600">
                    <div className="relative group">
                        <div className="flex items-start gap-4">
                            <LightBulbIcon className="w-8 h-8 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-1" />
                            <div className="pr-12">
                                <p className="font-bold text-lg text-gray-800 dark:text-gray-200 uppercase tracking-tight">Blessing Challenge</p>
                                <p className="text-gray-600 dark:text-gray-300 italic text-lg leading-relaxed mt-2">{challenge}</p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0">
                            <SpeechButton text={`Today's challenge: ${challenge}`} />
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-600/50"></div>

                    <div className="relative group">
                        <div className="flex items-start gap-4">
                            <QuoteIcon className="w-8 h-8 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" />
                            <div className="pr-12">
                                <p className="font-bold text-lg text-gray-800 dark:text-gray-200 uppercase tracking-tight">Daily Wisdom</p>
                                {isLoading ? (
                                    <div className="animate-pulse space-y-2 mt-3">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
                                    </div>
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-300 italic text-xl leading-relaxed mt-2">"{quote}"</p>
                                )}
                            </div>
                        </div>
                        {!isLoading && (
                            <div className="absolute top-0 right-0">
                                <SpeechButton text={`Daily wisdom: ${quote}`} />
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="text-center pt-4">
                    <button
                        onClick={onNewInspiration}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-sm text-blue-600 bg-blue-100 rounded-2xl hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all dark:text-blue-300 dark:bg-blue-900/60 dark:hover:bg-blue-900/80 shadow-sm"
                    >
                        {isLoading ? <LoaderIcon className="w-5 h-5 mr-2 animate-spin" /> : null}
                        {isLoading ? 'Seeking...' : 'Seek New Inspiration'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InspirationPage;
