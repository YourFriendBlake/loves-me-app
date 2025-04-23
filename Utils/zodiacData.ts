import { ZodiacInfo, ZodiacSign } from '../Types';

export const zodiacData: Record<ZodiacSign, ZodiacInfo> = {
  'Aries': {
    name: 'Aries',
    element: 'Fire',
    dateRange: 'Mar 21 - Apr 19',
    compatibleSigns: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius']
  },
  'Leo': {
    name: 'Leo',
    element: 'Fire',
    dateRange: 'Jul 23 - Aug 22',
    compatibleSigns: ['Aries', 'Sagittarius', 'Gemini', 'Libra']
  },
  'Sagittarius': {
    name: 'Sagittarius',
    element: 'Fire',
    dateRange: 'Nov 22 - Dec 21',
    compatibleSigns: ['Aries', 'Leo', 'Libra', 'Aquarius']
  },
  'Taurus': {
    name: 'Taurus',
    element: 'Earth',
    dateRange: 'Apr 20 - May 20',
    compatibleSigns: ['Virgo', 'Capricorn', 'Cancer', 'Pisces']
  },
  'Virgo': {
    name: 'Virgo',
    element: 'Earth',
    dateRange: 'Aug 23 - Sep 22',
    compatibleSigns: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio']
  },
  'Capricorn': {
    name: 'Capricorn',
    element: 'Earth',
    dateRange: 'Dec 22 - Jan 19',
    compatibleSigns: ['Taurus', 'Virgo', 'Scorpio', 'Pisces']
  },
  'Gemini': {
    name: 'Gemini',
    element: 'Air',
    dateRange: 'May 21 - Jun 20',
    compatibleSigns: ['Libra', 'Aquarius', 'Aries', 'Leo']
  },
  'Libra': {
    name: 'Libra',
    element: 'Air',
    dateRange: 'Sep 23 - Oct 22',
    compatibleSigns: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius']
  },
  'Aquarius': {
    name: 'Aquarius',
    element: 'Air',
    dateRange: 'Jan 20 - Feb 18',
    compatibleSigns: ['Gemini', 'Libra', 'Aries', 'Sagittarius']
  },
  'Cancer': {
    name: 'Cancer',
    element: 'Water',
    dateRange: 'Jun 21 - Jul 22',
    compatibleSigns: ['Scorpio', 'Pisces', 'Taurus', 'Virgo']
  },
  'Scorpio': {
    name: 'Scorpio',
    element: 'Water',
    dateRange: 'Oct 23 - Nov 21',
    compatibleSigns: ['Cancer', 'Pisces', 'Virgo', 'Capricorn']
  },
  'Pisces': {
    name: 'Pisces',
    element: 'Water',
    dateRange: 'Feb 19 - Mar 20',
    compatibleSigns: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn']
  }
};
