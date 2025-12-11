// components/ResultScreen.tsx
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Image } from 'react-native';
import { Audio } from 'expo-av';
import { ZodiacSign } from '../Types';

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
  
  // Initialize audio mode
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.log('Audio setup error:', error);
      }
    };
    setupAudio();
  }, []);

  // Play result sound effect
  useEffect(() => {
    const playResultSound = async () => {
      try {
        const soundFile = result 
          ? require('../assets/LovesYou.mp3')
          : require('../assets/LovesYouNot.mp3');
        
        const { sound } = await Audio.Sound.createAsync(
          soundFile,
          { shouldPlay: false, volume: 1.0 }
        );
        
        await sound.setVolumeAsync(1.0);
        const playbackStatus = await sound.playAsync();
        
        if (playbackStatus.isLoaded) {
          console.log('Result sound playing:', result ? 'LovesYou' : 'LovesYouNot');
        }
        
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync().catch(err => console.log('Unload error:', err));
          } else if (!status.isLoaded && status.error) {
            console.error('Result sound error:', status.error);
          }
        });
      } catch (error) {
        console.error('Result sound playback error:', error);
      }
    };
    
    playResultSound();
  }, [result]);
  
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
          <Image 
            source={require('../assets/WiltedFlower.png')} 
            style={styles.wiltedFlowerImage}
            resizeMode="contain"
          />
        )}
        <Text style={[styles.resultText, result ? styles.positiveResult : styles.negativeResult]}>
          {result ? `${name} loves you!` : `${name} loves you not.`}
        </Text>
        
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
  heartImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  wiltedFlowerImage: {
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
});

export default ResultScreen;
