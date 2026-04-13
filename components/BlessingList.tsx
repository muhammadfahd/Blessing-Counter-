
import React from 'react';
import { Blessing } from '../types';
import BlessingListItem from './BlessingListItem';

interface BlessingListProps {
  blessings: Blessing[];
  isLoading: boolean;
  onGenerateImage?: (id: number) => void;
}

const BlessingList: React.FC<BlessingListProps> = ({ blessings, isLoading, onGenerateImage }) => {
  if (blessings.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
        <p className="text-gray-400 dark:text-gray-500 font-medium">Your sanctuary of gratitude is empty.</p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-2 uppercase tracking-[0.2em]">Add your first blessing above</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blessings.map((blessing, index) => (
        <BlessingListItem 
            key={blessing.id} 
            blessing={blessing} 
            index={index} 
            onGenerateImage={onGenerateImage}
        />
      ))}
    </div>
  );
};

export default BlessingList;
