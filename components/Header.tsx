import React from 'react';
import { SparklesIcon } from './icons';
import ThemeToggle from './ThemeToggle';

type Page = 'counter' | 'inspiration' | 'journal' | 'achievements';
type Theme = 'light' | 'dark';

interface HeaderProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    unlockedAchievementsCount: number;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const NavLink: React.FC<{
    page: Page;
    currentPage: Page;
    onNavigate: (page: Page) => void;
    children: React.ReactNode;
    notificationCount?: number;
}> = ({ page, currentPage, onNavigate, children, notificationCount }) => {
    const isActive = page === currentPage;
    return (
        <button
            onClick={() => onNavigate(page)}
            className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive 
                ? 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/60' 
                : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            aria-current={isActive ? 'page' : undefined}
        >
            {children}
            {notificationCount && notificationCount > 0 ? (
                 <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {notificationCount}
                </span>
            ) : null}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, unlockedAchievementsCount, theme, setTheme }) => {
    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
            <nav className="container mx-auto px-4 py-3 max-w-5xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-7 h-7 text-yellow-500" />
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-200 font-serif hidden sm:block">Blessing Counter</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                    <NavLink page="counter" currentPage={currentPage} onNavigate={onNavigate}>Counter</NavLink>
                    <NavLink page="inspiration" currentPage={currentPage} onNavigate={onNavigate}>Inspiration</NavLink>
                    <NavLink page="journal" currentPage={currentPage} onNavigate={onNavigate}>Journal</NavLink>
                    <NavLink page="achievements" currentPage={currentPage} onNavigate={onNavigate} notificationCount={unlockedAchievementsCount}>
                        Achievements
                    </NavLink>
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                </div>
            </nav>
        </header>
    );
};

export default Header;