
import React, { useState, useCallback, useEffect } from 'react';
import { Blessing, Achievement, JournalEntry } from './types';
import { WORLD_POPULATION, CHALLENGES, ACHIEVEMENTS } from './constants';
import { estimateBlessingCount, fetchPersonalizedInsight, estimateCombinedBlessingCount, fetchInspirationalQuote, generateBlessingImage } from './services/geminiService';

import Header from './components/Header';
import CounterPage from './pages/CounterPage';
import InspirationPage from './pages/InspirationPage';
import JournalPage from './pages/JournalPage';
import AchievementsPage from './pages/AchievementsPage';
import { SparklesIcon } from './components/icons';

type Page = 'counter' | 'inspiration' | 'journal' | 'achievements';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [blessings, setBlessings] = useState<Blessing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [personalizedInsight, setPersonalizedInsight] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState<boolean>(false);
  
  const [overallLuckierThan, setOverallLuckierThan] = useState<number | null>(null);
  const [isOverallLoading, setIsOverallLoading] = useState<boolean>(false);

  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [currentChallenge, setCurrentChallenge] = useState<string>('');
  const [inspirationalQuote, setInspirationalQuote] = useState<string>('');
  const [isQuoteLoading, setIsQuoteLoading] = useState<boolean>(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const [page, setPage] = useState<Page>('counter');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = localStorage.getItem('theme') as Theme;
      if (storedTheme) return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    try {
        const storedEntries = localStorage.getItem('journalEntries');
        if (storedEntries) {
            setJournalEntries(JSON.parse(storedEntries));
        }
    } catch (e) {
        console.error("Failed to load journal entries", e);
    }
  }, []);

  const handleAddBlessing = useCallback(async (text: string, isPredefined: boolean = false) => {
    if (!text.trim()) return;

    if (blessings.some(b => b.text.toLowerCase() === text.toLowerCase())) {
        setError("You've already added this blessing.");
        setTimeout(() => setError(null), 3000);
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { count: blessedCount, fact, villageStat } = await estimateBlessingCount(text);
      const luckierThanCount = WORLD_POPULATION - blessedCount;

      const newBlessing: Blessing = {
        id: Date.now(),
        text,
        count: luckierThanCount > 0 ? luckierThanCount : 0,
        perspectiveFact: fact,
        villageStat,
        isPredefined,
      };

      setBlessings(prev => [...prev, newBlessing]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [blessings]);

  const handleGenerateImage = async (id: number) => {
      const blessing = blessings.find(b => b.id === id);
      if (!blessing) return;
      
      try {
          const url = await generateBlessingImage(blessing.text);
          setBlessings(prev => prev.map(b => b.id === id ? { ...b, imageUrl: url } : b));
      } catch (e) {
          setError("Failed to generate image.");
      }
  };
  
  const handleNewInspiration = useCallback(async () => {
    setIsQuoteLoading(true);
    const newChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    setCurrentChallenge(newChallenge);
    try {
        const newQuote = await fetchInspirationalQuote();
        setInspirationalQuote(newQuote);
    } catch (e) {
        setInspirationalQuote("Gratitude turns what we have into enough.");
    } finally {
        setIsQuoteLoading(false);
    }
  }, []);

  useEffect(() => {
    handleNewInspiration();
  }, [handleNewInspiration]);
  
  useEffect(() => {
    const newlyUnlocked = new Set<string>();
    ACHIEVEMENTS.forEach(ach => {
        if (!unlockedAchievements.has(ach.id) && ach.check(blessings)) {
            newlyUnlocked.add(ach.id);
        }
    });
    if (newlyUnlocked.size > 0) {
        setUnlockedAchievements(prev => new Set([...Array.from(prev), ...Array.from(newlyUnlocked)]));
    }
  }, [blessings]);

  useEffect(() => {
    if (blessings.length > 1) {
      const getInsight = async () => {
        setIsInsightLoading(true);
        try {
          const insight = await fetchPersonalizedInsight(blessings.map(b => b.text));
          setPersonalizedInsight(insight);
        } catch (e) {
          setPersonalizedInsight(null);
        } finally {
          setIsInsightLoading(false);
        }
      };
      getInsight();
    } else {
      setPersonalizedInsight(null);
    }
  }, [blessings]);

  useEffect(() => {
    const fetchOverallFortune = async () => {
      if (blessings.length > 1) {
        setIsOverallLoading(true);
        try {
          const combinedBlessedCount = await estimateCombinedBlessingCount(blessings.map(b => b.text));
          const luckierThanCount = WORLD_POPULATION - combinedBlessedCount;
          setOverallLuckierThan(luckierThanCount > 0 ? luckierThanCount : 0);
        } catch (e) {
          setOverallLuckierThan(null);
        } finally {
          setIsOverallLoading(false);
        }
      } else if (blessings.length === 1) {
        setOverallLuckierThan(blessings[0].count);
      } else {
        setOverallLuckierThan(null);
      }
    };
    fetchOverallFortune();
  }, [blessings]);
  
  const handleSaveJournalEntry = (content: string) => {
    const newEntry: JournalEntry = { id: Date.now(), date: new Date().toISOString(), content };
    const updatedEntries = [newEntry, ...journalEntries];
    setJournalEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
  };

  const handleClear = () => {
    setBlessings([]);
    setError(null);
    setPersonalizedInsight(null);
    setOverallLuckierThan(null);
    setUnlockedAchievements(new Set());
  }
  
  const renderPage = () => {
    switch (page) {
        case 'inspiration':
            return <InspirationPage 
                        challenge={currentChallenge}
                        quote={inspirationalQuote}
                        isLoading={isQuoteLoading}
                        onNewInspiration={handleNewInspiration}
                    />;
        case 'journal':
            return <JournalPage 
                        entries={journalEntries} 
                        onSaveEntry={handleSaveJournalEntry} 
                        blessings={blessings} 
                    />;
        case 'achievements':
            return <AchievementsPage unlockedAchievementIds={unlockedAchievements} />;
        case 'counter':
        default:
            return <CounterPage
                        blessings={blessings}
                        isLoading={isLoading}
                        error={error}
                        personalizedInsight={personalizedInsight}
                        isInsightLoading={isInsightLoading}
                        overallLuckierThan={overallLuckierThan}
                        isOverallLoading={isOverallLoading}
                        onAddBlessing={handleAddBlessing}
                        onGenerateImage={handleGenerateImage}
                        onClear={handleClear}
                    />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 text-gray-800 dark:from-gray-900 dark:to-slate-800 dark:text-gray-200 antialiased selection:bg-blue-100 dark:selection:bg-blue-900">
      <Header 
        currentPage={page} 
        onNavigate={setPage} 
        unlockedAchievementsCount={unlockedAchievements.size}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {renderPage()}
        <footer className="text-center mt-12 mb-8 text-sm text-gray-400 dark:text-gray-500">
          <p className="flex items-center justify-center gap-2">
            Made with <SparklesIcon className="w-4 h-4 text-yellow-500" /> for the grateful heart.
          </p>
          <p className="mt-2">Estimates generated by AI based on global demographic trends.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
