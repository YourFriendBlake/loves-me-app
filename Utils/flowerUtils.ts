import { ZodiacSign } from '../Types';

// Generate a random number of petals (9-12)
export const generatePetalCount = (): number => {
  return Math.floor(Math.random() * 4) + 9; // 9 to 12 petals
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