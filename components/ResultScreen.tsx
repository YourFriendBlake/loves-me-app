// components/ResultScreen.tsx
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Image } from 'react-native';
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
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    // Animate the result screen appearance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
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
      <Animated.View 
        style={[
          styles.resultContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {result ? (
          <Image 
            source={require('../assets/Heart.png')} 
            style={styles.heartImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.emoji}>😢😢😢</Text>
        )}
        <Text style={[styles.resultText, result ? styles.positiveResult : styles.negativeResult]}>
          {result ? `${name} loves you!` : `${name} loves you not.`}
        </Text>
        
        {userSign && crushSign && (
          <View style={styles.compatibilityContainer}>
            <Text style={styles.compatibilityTitle}>Astrological Compatibility</Text>
            <Text style={styles.compatibilityText}>
              {getCompatibilityText()}
            </Text>
            {compatibilityScore !== null && (
              <Text style={styles.compatibilityScore}>
                Compatibility Score: {compatibilityScore}%
              </Text>
            )}
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.playAgainButton} 
          onPress={onPlayAgain}
          activeOpacity={0.8}
        >
          <Text style={styles.playAgainText}>Play Again</Text>
        </TouchableOpacity>
      </Animated.View>
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
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  positiveResult: {
    color: '#FF1493', // Deep pink for positive
  },
  negativeResult: {
    color: '#8B7D8B', // Muted purple for negative
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  heartImage: {
    width: 150,
    height: 150,
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
    padding: 20,
    backgroundColor: '#FFF0F5',
    borderRadius: 15,
    width: '100%',
    borderWidth: 2,
    borderColor: '#FFB6C1',
  },
  compatibilityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 10,
  },
  compatibilityText: {
    fontSize: 16,
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  compatibilityScore: {
    fontSize: 14,
    color: '#FF69B4',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 5,
  },
});

export default ResultScreen;
