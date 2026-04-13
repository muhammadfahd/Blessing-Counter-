import React, { useState } from 'react';
import { PlusIcon, LoaderIcon } from './icons';

interface BlessingInputFormProps {
    onAddBlessing: (text: string) => void;
    isLoading: boolean;
}

const BlessingInputForm: React.FC<BlessingInputFormProps> = ({ onAddBlessing, isLoading }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || isLoading) return;
        onAddBlessing(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., I have a loving family"
                className="flex-grow w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 transition-shadow"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={!text.trim() || isLoading}
                className="flex-shrink-0 inline-flex items-center justify-center px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
            >
                {isLoading ? (
                    <>
                       <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
                       Counting...
                    </>
                ) : (
                    <>
                       <PlusIcon className="w-5 h-5 mr-2" />
                       Count Blessing
                    </>
                )}
            </button>
        </form>
    );
};

export default BlessingInputForm;