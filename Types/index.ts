export type ZodiacSign = 
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' 
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' 
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type ElementType = 'Fire' | 'Earth' | 'Air' | 'Water';

export interface ZodiacInfo {
  name: ZodiacSign;
  element: ElementType;
  dateRange: string;
  compatibleSigns: ZodiacSign[];
}
