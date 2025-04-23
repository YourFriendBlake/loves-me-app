// components/ZodiacSelector.tsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ZodiacSign } from '../Types';
import { zodiacData } from '../Utils/zodiacData';

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
  const getEmoji = (element: string): string => {
    switch (element) {
      case 'Fire': return '🔥';
      case 'Earth': return '🌱';
      case 'Air': return '🌬️';
      case 'Water': return '💧';
      default: return '✨';
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.signsContainer}>
          {Object.values(zodiacData).map((zodiac) => (
            <TouchableOpacity
              key={zodiac.name}
              style={[
                styles.signButton,
                selectedSign === zodiac.name && styles.selectedSign,
                { borderColor: selectedSign === zodiac.name ? '#FF6B6B' : '#ccc' }
              ]}
              onPress={() => onSelect(zodiac.name)}
            >
              <Text style={styles.emoji}>{getEmoji(zodiac.element)}</Text>
              <Text style={styles.signName}>{zodiac.name}</Text>
              <Text style={styles.dateRange}>{zodiac.dateRange}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 10,
  },
  signsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  signButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    width: 100,
    alignItems: 'center',
  },
  selectedSign: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 2,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  signName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateRange: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default ZodiacSelector;
