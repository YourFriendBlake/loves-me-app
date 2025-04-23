import { ZodiacSign } from '../Types/index';
import { zodiacData } from './zodiacData';

export const calculateCompatibility = (sign1: ZodiacSign, sign2: ZodiacSign): number => {
  // Base probability: 50%
  let compatibilityScore = 50;
  
  // If the signs are the same, extra compatibility
  if (sign1 === sign2) {
    compatibilityScore += 10;
  }
  
  // If signs are compatible according to our data
  if (zodiacData[sign1].compatibleSigns.includes(sign2)) {
    compatibilityScore += 20;
  }
  
  // If signs have the same element
  if (zodiacData[sign1].element === zodiacData[sign2].element) {
    compatibilityScore += 15;
  }
  
  // Add some randomness (±5%)
  const randomFactor = Math.floor(Math.random() * 11) - 5;
  compatibilityScore += randomFactor;
  
  // Ensure the score is between 10% and 90%
  compatibilityScore = Math.max(10, Math.min(90, compatibilityScore));
  
  return compatibilityScore;
}; 