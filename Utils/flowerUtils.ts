import { ZodiacSign } from '../Types';

// Generate a random number of petals (8-12)
export const generatePetalCount = (): number => {
  return Math.floor(Math.random() * 5) + 8; // 8 to 12 petals
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