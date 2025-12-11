// components/ZodiacSelector.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { ZodiacSign } from '../Types';
import { zodiacData } from '../Utils/zodiacData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_COLUMNS = 4;
const GRID_PADDING = 20; // Total horizontal padding (10 on each side)
const GRID_GAP = 8;
// Calculate button width accounting for margins on both sides (GRID_GAP/2 each side = GRID_GAP total per button)
const BUTTON_WIDTH = (SCREEN_WIDTH - GRID_PADDING - (GRID_GAP * GRID_COLUMNS)) / GRID_COLUMNS;

interface ZodiacSelectorProps {
  title: string;
  selectedSign: ZodiacSign | undefined;
  onSelect: (sign: ZodiacSign) => void;
}

const ZodiacSelector: React.FC<ZodiacSelectorProps> = ({ 
  title,
  selectedSign,
  onSelect
}) => {
  const [isGridVisible, setIsGridVisible] = useState(false);

  const getEmoji = (element: string): string => {
    switch (element) {
      case 'Fire': return '🔥';
      case 'Earth': return '🪨';
      case 'Air': return '💨';
      case 'Water': return '💧';
      default: return '✨';
    }
  };

  const zodiacSigns = Object.values(zodiacData);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsGridVisible(!isGridVisible)}
        >
          <Text style={styles.toggleButtonText}>
            {isGridVisible ? '▼' : '▶'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {isGridVisible && (
        <View style={styles.gridContainer}>
          {zodiacSigns.map((zodiac) => (
            <TouchableOpacity
              key={zodiac.name}
              style={[
                styles.gridButton,
                selectedSign === zodiac.name && styles.selectedSign,
                { 
                  borderColor: selectedSign === zodiac.name ? '#FF6B6B' : '#ccc',
                }
              ]}
              onPress={() => onSelect(zodiac.name)}
            >
              <Text style={styles.gridEmoji}>{getEmoji(zodiac.element)}</Text>
              <Text 
                style={styles.gridSignName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {zodiac.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFB6C1',
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    paddingVertical: 12,
    width: BUTTON_WIDTH,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    minHeight: 70,
    marginHorizontal: GRID_GAP / 2,
  },
  selectedSign: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 2,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  gridEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  signName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gridSignName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
});

export default ZodiacSelector;
