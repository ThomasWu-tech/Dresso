export type ScreenName = 'onboarding' | 'generator' | 'outfits' | 'closet' | 'profile';

export interface Outfit {
  id: string;
  title: string;
  images: string[];
  tag: string;
  itemCount: number;
  tagColor?: string;
  isFavorite?: boolean;
  matchPercentage?: number;
  description?: string;
  accessories?: Accessory[];
}

export interface Accessory {
  id: string;
  name: string;
  image: string;
  type: 'clothing' | 'shopping';
}

export interface WardrobeItem {
  id: string;
  name: string;
  image: string;
  category: string;
  isSelected?: boolean;
}
