// components/Flower.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import Petal from './Petal';
import { ZodiacSign } from '../Types';
import { determineResult } from '../Utils/flowerUtils';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface FlowerProps {
  petalCount: number;
  name: string;
  userSign?: ZodiacSign;
  crushSign?: ZodiacSign;
  onComplete: (result: boolean) => void;
  soundEnabled: boolean;
}

const Flower: React.FC<FlowerProps> = ({ 
  petalCount, 
  name, 
  userSign, 
  crushSign, 
  onComplete,
  soundEnabled
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
      
      // Check if all petals are removed
      if (newRemovedPetals.length === petalCount && petalCount > 0) {
        // Use setTimeout to ensure the last petal animation completes
        setTimeout(() => {
          setHasCompleted(true);
          const result = determineResult(petalCount, userSign, crushSign);
          onComplete(result);
        }, 600);
      }
      
      return newRemovedPetals;
    });
  };
  // Reset completion state when petalCount changes
  useEffect(() => {
    setRemovedPetals([]);
    setCurrentState(null);
    setHasCompleted(false);
  }, [petalCount]);
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {currentState && (
          <View style={styles.statusContainer}>
            <Text style={styles.status} numberOfLines={2}>
              {currentState === 'loves' ? `${name} loves me...` : `${name} loves me not...`}
            </Text>
          </View>
        )}
        
        {/* Stem - positioned relative to screen to reach bottom - rendered first to be behind everything */}
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
          {/* Flower center - rendered before petals to be behind them */}
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
          
          {/* Petals - rendered last to appear on top */}
          {Array.from({ length: petalCount }).map((_, index) => (
            <Petal
              key={index}
              angle={getPetalPosition(index)}
              onRemove={() => handlePetalRemove(index)}
              index={index}
              isRemoved={removedPetals.includes(index)}
              center={{ x: flowerSize.width / 2, y: flowerSize.height / 2 }}
              // Bring petals closer so their bases tuck right up against the center.
              // Slightly inside the yellow center radius so they hug the flower.
              radius={(centerSize.width / 2) - 20}
              soundEnabled={soundEnabled}
            />
          ))}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    paddingHorizontal: 20,
  },
  status: {
    fontSize: 35,
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: '90%',
  },
  flowerContainer: {
    width: 650,   // slightly smaller overall flower area
    height: 650,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stemContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2.1, // Flower center is at screen center (container is centered)
    // Center horizontally: screen center minus half stem container width
    left: SCREEN_WIDTH / 1 - 90,
    width: 150,
    height: SCREEN_HEIGHT / 2, // Extend from flower center to bottom of screen
    zIndex: -1, // Behind everything (petals start at zIndex 10, flower center at 2000)
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
    width: 60,
    height: 60,
  },
});

export default Flower;
