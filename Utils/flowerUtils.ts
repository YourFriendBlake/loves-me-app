import { ZodiacSign } from '../Types';

// Generate a random number of petals (14-19)
export const generatePetalCount = (): number => {
  return Math.floor(Math.random() * 6) + 14; // 14 to 19 petals
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