import { ZodiacSign } from '../Types';

// Generate a random number of petals (18-21)
export const generatePetalCount = (): number => {
  return Math.floor(Math.random() * 4) + 18; // 18 to 21 petals
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