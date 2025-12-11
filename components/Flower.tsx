// components/Flower.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import Petal from './Petal';
import { ZodiacSign } from '../Types';
import { determineResult } from '../Utils/flowerUtils';
import { zodiacData } from '../Utils/zodiacData';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface FlowerProps {
  petalCount: number;
  name: string;
  userSign?: ZodiacSign;
  crushSign?: ZodiacSign;
  onComplete: (result: boolean) => void;
}

const Flower: React.FC<FlowerProps> = ({ 
  petalCount, 
  name, 
  userSign, 
  crushSign, 
  onComplete 
}) => {
  const [removedPetals, setRemovedPetals] = useState<number[]>([]);
  const [currentState, setCurrentState] = useState<'loves' | 'loves not' | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [flowerSize, setFlowerSize] = useState({ width: 720, height: 720 });
  const [centerSize, setCenterSize] = useState({ width: 75, height: 75 }); // default to your styled size
  
  const getPetalPosition = (index: number) => {
    const angleStep = 360 / petalCount;
    const baseAngle = index * angleStep;
    // Add 90 degrees to rotate all petals
    return baseAngle + 90;
  };

  const handlePetalRemove = (index: number) => {
    setRemovedPetals(prev => {
      // Only add if not already removed
      if (prev.includes(index)) {
        return prev;
      }
      const newRemovedPetals = [...prev, index];
      // First petal removal shows "loves me", then toggle for subsequent removals
      setCurrentState(prevState => {
        if (prevState === null) {
          return 'loves'; // First removal shows "loves me"
        }
        return prevState === 'loves' ? 'loves not' : 'loves';
      });
      return newRemovedPetals;
    });
  };

  // Reset completion state when petalCount changes
  useEffect(() => {
    setRemovedPetals([]);
    setCurrentState(null);
    setHasCompleted(false);
  }, [petalCount]);

  // Check if all petals have been removed
  useEffect(() => {
    if (removedPetals.length === petalCount && !hasCompleted && petalCount > 0) {
      setHasCompleted(true);
      // Wait a bit to ensure the last petal's animation has fully completed
      setTimeout(() => {
        const result = determineResult(petalCount, userSign, crushSign);
        onComplete(result);
      }, 500); // Delay to ensure petal has fully fallen off screen
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removedPetals.length, petalCount, hasCompleted]);
  
  return (
    <View style={styles.container}>
      {currentState && (
        <Text style={styles.status}>
          {currentState === 'loves' ? `${name} loves me...` : `${name} loves me not...`}
        </Text>
      )}
      
      {/* Stem - positioned relative to screen to reach bottom */}
      <View style={styles.stemContainer} pointerEvents="none">
        <Image 
          source={require('../assets/Stem.png')} 
          style={styles.stemImage}
          resizeMode="contain"
        />
      </View>
      
      <View
        style={styles.flowerContainer}
        pointerEvents="box-none"
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setFlowerSize({ width, height });
        }}
      >
        {/* Petals */}
        {Array.from({ length: petalCount }).map((_, index) => (
          <Petal
            key={index}
            angle={getPetalPosition(index)}
            onRemove={() => handlePetalRemove(index)}
            index={index}
            isRemoved={removedPetals.includes(index)}
            center={{ x: flowerSize.width / 2, y: flowerSize.height / 2 }}
            // Place the petal base on the rim of the yellow center,
            // with a tiny margin so petals don't overlap the center art.
            radius={(centerSize.width / 2) - 10}
          />
        ))}
        
        {/* Center of the flower - rendered last to appear on top */}
        <View
          style={styles.flowerImageContainer}
          pointerEvents="none"
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setCenterSize({ width, height });
          }}
        >
          <Image 
            source={require('../assets/Flower.png')} 
            style={styles.flowerImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    fontSize: 35,
    fontStyle: 'italic',
    position: 'absolute',
    top: 130, // Adjust this value to move text up or down
    alignSelf: 'center',
    zIndex: 10,
  },
  flowerContainer: {
    width: 720,
    height: 720,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stemContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2.1, // Flower center is at screen center (container is centered)
    left: SCREEN_WIDTH / 1 - 85, // Center horizontally: screen center minus half width
    width: 150,
    height: SCREEN_HEIGHT / 2, // Extend from flower center to bottom of screen
    zIndex: 0, // Behind petals (which start at zIndex 10) and flower center
    justifyContent: 'flex-start',
    alignItems: 'center',
    transform: [{ rotate: '15deg' }], // Adjust this value to rotate the stem (e.g., '5deg', '-5deg')
  },
  stemImage: {
    width: 225,
    height: SCREEN_HEIGHT / 2.6, // Match container height
  },
  flowerImageContainer: {
    width: 75,
    height: 75,
    position: 'absolute',
    zIndex: 2000, // Higher than any petal (even when dragging at zIndex 1000)
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowerImage: {
    width: 75,
    height: 75,
  },
});

export default Flower;
