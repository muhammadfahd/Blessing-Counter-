import React from 'react';
import { ACHIEVEMENTS } from '../constants';
import Badge from '../components/Badge';

interface AchievementsPageProps {
    unlockedAchievementIds: Set<string>;
}

const AchievementsPage: React.FC<AchievementsPageProps> = ({ unlockedAchievementIds }) => {
    const unlockedCount = unlockedAchievementIds.size;
    const totalCount = ACHIEVEMENTS.length;

    return (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 md:p-8">
            <header className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 font-serif">Your Achievements</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    You've unlocked {unlockedCount} of {totalCount} badges. Keep counting your blessings!
                </p>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {ACHIEVEMENTS.map(achievement => (
                    <Badge
                        key={achievement.id}
                        achievement={achievement}
                        isUnlocked={unlockedAchievementIds.has(achievement.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AchievementsPage;