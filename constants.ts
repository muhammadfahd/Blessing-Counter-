
import { Achievement } from './types';
import { 
    TrophyIcon, 
    StarIcon, 
    BookmarkIcon, 
    CameraIcon, 
    BoltIcon, 
    GlobeIcon, 
    MapIcon 
} from './components/icons';

// Approximate world population as of mid-2024
export const WORLD_POPULATION = 8_100_000_000;

export const PREDEFINED_BLESSINGS = [
    "I have access to clean drinking water",
    "I have a roof over my head",
    "I ate today",
    "I have access to the internet",
    "I can read and write",
    "I have a family that loves me",
    "I have completed high school",
    "I live in a peaceful country",
];

export const CHART_COLORS = [
    '#3b82f6', // blue-500
    '#22c55e', // green-500
    '#eab308', // yellow-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#f97316', // orange-500
    '#14b8a6', // teal-500
    '#ec4899', // pink-500
];

export const CHALLENGES: string[] = [
    "Reflect on a person you're grateful for today.",
    "What's one small thing that brought you joy recently?",
    "Share a skill you're thankful to have.",
    "Think of a challenge you overcame and what you learned.",
    "What aspect of nature are you most grateful for?",
];

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first-step',
        name: 'First Step',
        description: 'Add your very first blessing.',
        check: (blessings) => blessings.length >= 1,
        icon: StarIcon,
    },
    {
        id: 'quick-start',
        name: 'Quick Start',
        description: 'Add a blessing from the predefined list.',
        check: (blessings) => blessings.some(b => b.isPredefined),
        icon: BookmarkIcon,
    },
    {
        id: 'grateful-heart',
        name: 'Grateful Heart',
        description: 'Track 5 different blessings.',
        check: (blessings) => blessings.length >= 5,
        icon: TrophyIcon,
    },
    {
        id: 'art-collector',
        name: 'Art Collector',
        description: 'Generate 3 AI Gratitude Postcards.',
        check: (blessings) => blessings.filter(b => !!b.imageUrl).length >= 3,
        icon: CameraIcon,
    },
    {
        id: 'rarity-hunter',
        name: 'Rarity Hunter',
        description: 'Find a blessing shared by less than 300 million people.',
        check: (blessings) => blessings.some(b => b.count >= 7_800_000_000),
        icon: BoltIcon,
    },
    {
        id: 'village-elder',
        name: 'Village Elder',
        description: 'Discover facts for 5 different blessings.',
        check: (blessings) => blessings.filter(b => !!b.perspectiveFact).length >= 5,
        icon: MapIcon,
    },
    {
        id: 'gratitude-pro',
        name: 'Gratitude Pro',
        description: 'Reach a milestone of 10 blessings.',
        check: (blessings) => blessings.length >= 10,
        icon: TrophyIcon,
    },
    {
        id: 'global-citizen',
        name: 'Global Citizen',
        description: 'Add 20 blessings to your sanctuary.',
        check: (blessings) => blessings.length >= 20,
        icon: GlobeIcon,
    }
];
