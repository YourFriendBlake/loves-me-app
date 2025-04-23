// components/ResultScreen.tsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ZodiacSign } from '../Types';
import { calculateCompatibility } from '../Utils/compatibility';
import { zodiacData } from '../Utils/zodiacData';

interface ResultScreenProps {
  result: boolean;
  name: string;
  userSign?: ZodiacSign;
  crushSign?: ZodiacSign;
  onPlayAgain: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ 
  result, 
  name, 
  userSign, 
  crushSign,
  onPlayAgain 
}) => {
  const compatibilityScore = userSign && crushSign 
    ? calculateCompatibility(userSign, crushSign) 
    : null;
  
  const getCompatibilityText = () => {
    if (!compatibilityScore || !userSign || !crushSign) return null;
    
    if (compatibilityScore >= 75) {
      return "The stars suggest you two have a powerful connection!";
    } else if (compatibilityScore >= 50) {
      return "Your signs indicate good compatibility.";
    } else if (compatibilityScore >= 25) {
      return "There's some astrological tension, but that can create a dynamic relationship.";
    } else {
      return "Astrologically speaking, this match may require some effort.";
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.resultContainer}>
        <Text style={styles.emoji}>
          {result ? "❤️❤️❤️" : "😢😢😢"}
        </Text>
        <Text style={styles.resultText}>
          {result ? `${name} loves you!` : `${name} loves you not.`}
        </Text>
        
        {userSign && crushSign && (
          <View style={styles.compatibilityContainer}>
            <Text style={styles.compatibilityText}>
              {getCompatibilityText()}
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.playAgainButton} 
          onPress={onPlayAgain}
        >
          <Text style={styles.playAgainText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F5', // Light pink background
    padding: 20,
  },
  resultContainer: {
    backgroundColor: '#FFE4E1', // Light pink container
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#FFB6C1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF69B4', // Pink text
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  playAgainButton: {
    backgroundColor: '#FFB6C1', // Light pink button
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  playAgainText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  compatibilityContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFE4E1',
    borderRadius: 15,
    width: '100%',
  },
  compatibilityText: {
    fontSize: 16,
    color: '#FF69B4',
    textAlign: 'center',
  },
});

export default ResultScreen;
