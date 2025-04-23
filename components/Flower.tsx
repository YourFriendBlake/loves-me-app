// components/Flower.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Petal from './Petal';
import { ZodiacSign } from '../Types';
import { determineResult } from '../Utils/flowerUtils';
import { zodiacData } from '../Utils/zodiacData';

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
  const [currentState, setCurrentState] = useState<'loves' | 'loves not'>('loves');
  
  const getPetalPosition = (index: number) => {
    const angleStep = 360 / petalCount;
    const baseAngle = index * angleStep;
    // Add 90 degrees to rotate all petals
    return baseAngle + 90;
  };

  const handlePetalRemove = (index: number) => {
    if (!removedPetals.includes(index)) {
      const newRemovedPetals = [...removedPetals, index];
      setRemovedPetals(newRemovedPetals);
      setCurrentState(prev => prev === 'loves' ? 'loves not' : 'loves');
      
      // Check if this was the last petal
      if (newRemovedPetals.length === petalCount) {
        const result = determineResult(petalCount, userSign, crushSign);
        onComplete(result);
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {currentState === 'loves' ? `${name} loves me...` : `${name} loves me not...`}
      </Text>
      
      <View style={styles.flowerContainer}>
        {/* Petals */}
        {Array.from({ length: petalCount }).map((_, index) => (
          <Petal
            key={index}
            angle={getPetalPosition(index)}
            onRemove={() => handlePetalRemove(index)}
            index={index}
            isRemoved={removedPetals.includes(index)}
          />
        ))}
        
        {/* Center of the flower - rendered last to appear on top */}
        <Image 
          source={require('../assets/Flower.png')} 
          style={styles.flowerImage}
          resizeMode="contain"
        />
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
    fontSize: 24,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  flowerContainer: {
    width: 720,
    height: 720,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowerImage: {
    width: 270,
    height: 270,
    position: 'absolute',
    zIndex: 10,
  },
});

export default Flower;
