// components/ImageText.tsx
import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ImageTextProps {
  text: string;
  letterHeight?: number;
  letterSpacing?: number;
  color?: string;
  style?: ViewStyle;
  fallbackStyle?: TextStyle; // Style for fallback text when images aren't available
  useImages?: boolean; // Toggle to use images or fallback to text
}

// Helper function to safely get letter images
// Add require statements here as you add image files to assets/letters/
const getLetterImage = (char: string): any => {
  const upperChar = char.toUpperCase();
  
  // Map each character to its image file
  const letterMap: { [key: string]: any } = {
    'A': require('../assets/letters/A.png'),
    'B': require('../assets/letters/B.png'),
    'C': require('../assets/letters/C.png'),
    'D': require('../assets/letters/D.png'),
    'E': require('../assets/letters/E.png'),
    'F': require('../assets/letters/F.png'),
    'G': require('../assets/letters/G.png'),
    'H': require('../assets/letters/H.png'),
    'I': require('../assets/letters/I.png'),
    'J': require('../assets/letters/J.png'),
    'K': require('../assets/letters/K.png'),
    'L': require('../assets/letters/L.png'),
    'M': require('../assets/letters/M.png'),
    'N': require('../assets/letters/N.png'),
    'O': require('../assets/letters/O.png'),
    'P': require('../assets/letters/P.png'),
    'Q': require('../assets/letters/Q.png'),
    'R': require('../assets/letters/R.png'),
    'S': require('../assets/letters/S.png'),
    'T': require('../assets/letters/T.png'),
    'U': require('../assets/letters/U.png'),
    'V': require('../assets/letters/V.png'),
    'W': require('../assets/letters/W.png'),
    'X': require('../assets/letters/X.png'),
    'Y': require('../assets/letters/Y.png'),
    'Z': require('../assets/letters/Z.png'),
    ' ': null, // Space - no image
    // Numbers (optional - add when you have them):
    // '0': require('../assets/letters/0.png'),
    // '1': require('../assets/letters/1.png'),
    // etc.
  };
  
  return letterMap[upperChar] || null;
};

const ImageText: React.FC<ImageTextProps> = ({ 
  text, 
  letterHeight = 40, 
  letterSpacing = 4,
  style,
  fallbackStyle,
  useImages = true,
}) => {
  // If useImages is false, always show text
  if (!useImages) {
    return (
      <View style={style}>
        <Text style={[styles.fallbackText, { fontSize: letterHeight }, fallbackStyle]}>
          {text}
        </Text>
      </View>
    );
  }
  
  const letters = text.split('');
  
  // Check if we have any images available
  const hasImages = letters.some(char => {
    const img = getLetterImage(char);
    return img !== null && img !== undefined;
  });
  
  // If no images available, fall back to regular text
  if (!hasImages) {
    return (
      <View style={style}>
        <Text style={[styles.fallbackText, { fontSize: letterHeight }, fallbackStyle]}>
          {text}
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, style]}>
      {letters.map((char, index) => {
        const imageSource = getLetterImage(char);
        
        // Special handling for spaces: create a wider gap (tab-like)
        if (char === ' ') {
          return (
            <View
              key={`space-${index}`}
              style={{
                width: letterSpacing * 4, // tab-style spacing
                height: letterHeight,
              }}
            />
          );
        }

        // If no image for this character, render as text
        if (!imageSource) {
          return (
            <Text
              key={`${char}-${index}`}
              style={[
                styles.fallbackLetter,
                { 
                  fontSize: letterHeight,
                  marginRight: index < letters.length - 1 ? letterSpacing : 0,
                },
                fallbackStyle
              ]}
            >
              {char}
            </Text>
          );
        }
        
        return (
          <Image
            key={`${char}-${index}`}
            source={imageSource}
            style={[
              styles.letter,
              {
                height: letterHeight,
                width: letterHeight * 0.8, // Adjust aspect ratio as needed
                marginRight: index < letters.length - 1 ? letterSpacing : 0,
              }
            ]}
            resizeMode="contain"
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  letter: {
    // Additional letter styling can go here
  },
  fallbackText: {
    textAlign: 'center',
    color: '#333', // Default text color
  },
  fallbackLetter: {
    textAlign: 'center',
    color: '#333', // Default text color
  },
});

export default ImageText;
