import { ZodiacSign } from '../Types';

// Generate a random number of petals (5-12 is typical for daisies)
export const generatePetalCount = (): number => {
  return Math.floor(Math.random() * 8) + 5; // 5 to 12 petals
};

// Determine the final result based on petal count
export const determineResult = (
  petalCount: number, 
  userSign?: ZodiacSign,
  crushSign?: ZodiacSign
): boolean => {
  // Odd number of petals means "loves me", even means "loves me not"
  return petalCount % 2 === 1;
};