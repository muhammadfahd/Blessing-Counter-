
import React from 'react';

export interface Blessing {
  id: number;
  text: string;
  count: number;
  perspectiveFact?: string;
  villageStat?: string; // e.g., "In a village of 100, only 12 would have this."
  imageUrl?: string;    // AI generated image URL
  isPredefined?: boolean;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    check: (blessings: Blessing[]) => boolean;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface JournalEntry {
    id: number;
    date: string;
    content: string;
}
