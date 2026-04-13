
import React, { useState } from 'react';
import { Blessing } from '../types';
import { ShareIcon, SaveIcon, ClipboardCheckIcon, TrashIcon, XIcon, FacebookIcon, LinkedInIcon } from './icons';

interface SummaryActionsProps {
  blessings: Blessing[];
  onClear: () => void;
  overallSummaryText: string;
  personalizedInsight: string | null;
}

const SummaryActions: React.FC<SummaryActionsProps> = ({ blessings, onClear, overallSummaryText, personalizedInsight }) => {
  const [copied, setCopied] = useState<'' | 'share' | 'save'>('');

  const getFullShareText = () => {
    const header = "Gratitude is a superpower. 🌍✨\n\nI just used the Blessing Counter and realized my life is statistically extraordinary.\n\n";
    const footer = "\n\nGain your own perspective here: [Your App URL]";
    const insightPart = personalizedInsight ? `💡 My Reflection: ${personalizedInsight}\n` : '';
    
    return `${header}${overallSummaryText}\n\n${insightPart}${footer}`;
  };

  const handleCopy = (type: 'share' | 'save') => {
    const textToCopy = getFullShareText();
    navigator.clipboard.writeText(textToCopy);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const shareToX = () => {
    const countText = overallSummaryText.replace("In total, I'm luckier than an estimated ", "").replace(" people.", "");
    const text = `Mind blown. 🤯 I'm luckier than ${countText} people on Earth. \n\nGratitude isn't just a feeling, it's a statistic. \n\nCheck your luck: #BlessingCounter #Gratitude`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const text = getFullShareText();
    navigator.clipboard.writeText(text);
    alert("Perspective Summary copied to clipboard! Paste it into your post.");
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank');
  };

  const shareToLinkedIn = () => {
    const text = getFullShareText();
    navigator.clipboard.writeText(text);
    // Visual feedback is better than a native alert for world-class apps
    setCopied('share');
    setTimeout(() => {
        setCopied('');
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    }, 800);
  };

  return (
    <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
            onClick={onClear}
            className="inline-flex items-center justify-center px-4 py-2 font-medium text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all uppercase tracking-widest"
        >
            <TrashIcon className="w-4 h-4 mr-2" />
            Reset Sanctuary
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleCopy('share')}
            className="inline-flex items-center justify-center px-5 py-2.5 font-bold text-sm text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 rounded-xl hover:bg-blue-200 transition-all shadow-sm active:scale-95"
          >
            {copied === 'share' ? <ClipboardCheckIcon className="w-5 h-5 mr-2" /> : <ShareIcon className="w-5 h-5 mr-2" />}
            {copied === 'share' ? 'Copied to Clipboard' : 'Copy Full Summary'}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/40 dark:to-gray-800/20 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/30 flex flex-col items-center justify-center gap-6 shadow-inner">
        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">Broadcast your perspective</span>
        <div className="flex gap-6">
            <button
                onClick={shareToX}
                className="group flex items-center justify-center w-14 h-14 text-white bg-black dark:bg-gray-700 rounded-2xl hover:scale-110 hover:-rotate-6 transition-all shadow-xl"
                title="Share on X"
            >
                <XIcon className="w-6 h-6" />
            </button>
            <button
                onClick={shareToFacebook}
                className="group flex items-center justify-center w-14 h-14 text-white bg-[#1877F2] rounded-2xl hover:scale-110 hover:rotate-6 transition-all shadow-xl"
                title="Share on Facebook"
            >
                <FacebookIcon className="w-6 h-6" />
            </button>
            <button
                onClick={shareToLinkedIn}
                className="group flex items-center justify-center w-14 h-14 text-white bg-[#0A66C2] rounded-2xl hover:scale-110 hover:-rotate-6 transition-all shadow-xl"
                title="Share on LinkedIn"
            >
                <LinkedInIcon className="w-6 h-6" />
            </button>
        </div>
        <p className="text-[10px] text-gray-400 italic">Clicking LinkedIn/Facebook will copy the summary to your clipboard first.</p>
      </div>
    </div>
  );
};

export default SummaryActions;
