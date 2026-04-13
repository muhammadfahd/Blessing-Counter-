import React from 'react';
import { PREDEFINED_BLESSINGS } from '../constants';

interface PredefinedBlessingsProps {
  onAddBlessing: (text: string, isPredefined: boolean) => void;
  isLoading: boolean;
  existingBlessings: string[];
}

const PredefinedBlessings: React.FC<PredefinedBlessingsProps> = ({ onAddBlessing, isLoading, existingBlessings }) => {
  return (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 text-center">Or add a common blessing:</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {PREDEFINED_BLESSINGS.map((blessing) => {
          const isAdded = existingBlessings.some(b => b.toLowerCase() === blessing.toLowerCase());
          return (
            <button
              key={blessing}
              onClick={() => onAddBlessing(blessing, true)}
              disabled={isLoading || isAdded}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                isAdded
                  ? 'bg-green-200 text-green-800 dark:bg-green-800/50 dark:text-green-200 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900/50 dark:hover:text-blue-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600'
              }`}
            >
              {blessing}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PredefinedBlessings;