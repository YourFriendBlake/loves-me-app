// components/ResultScreen.tsx
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Image, ImageBackground } from 'react-native';
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
  const [isHeartLarge, setIsHeartLarge] = React.useState(false);
  
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

  // Heart "frame cut" size change: toggle between normal and 1.5x every second
  useEffect(() => {
    if (!result) return; // Only toggle when showing the heart

    const intervalId = setInterval(() => {
      setIsHeartLarge(prev => !prev);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [result]);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.resultContainer,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <ImageBackground
          source={require('../assets/Crumpled paper.jpeg')}
          style={styles.paperBackground}
          resizeMode="cover"
        >
          {result ? (
            <View
              style={{
                transform: [{ scale: isHeartLarge ? 1.5 : 1 }],
              }}
            >
              <Image 
                source={require('../assets/Heart.png')} 
                style={styles.heartImage}
                resizeMode="contain"
              />
            </View>
          ) : (
            <>
              <View style={styles.flowerStemContainer}>
                <Image 
                  source={require('../assets/Stem.png')} 
                  style={styles.stemImage}
                  resizeMode="contain"
                />
                <Image 
                  source={require('../assets/Flower.png')} 
                  style={styles.flowerImage}
                  resizeMode="contain"
                />
              </View>
            </>
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
        </ImageBackground>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
  },
  resultContainer: {
    alignItems: 'center',
    shadowColor: '#4169E1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  paperBackground: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    overflow: 'hidden', // Ensure the image respects borderRadius
    position: 'relative', // For absolute positioning of petals
  },
  resultText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  positiveResult: {
    color: '#4169E1', // Royal blue for positive
  },
  negativeResult: {
    color: '#1F3B70', // Darker blue for negative
  },
  heartImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  flowerStemContainer: {
    width: 120,
    height: 170,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stemImage: {
    position: 'absolute',
    width: 60,
    height: 120,
    bottom: 0,
    transform: [{ rotate: '10deg' }],
  },
  flowerImage: {
    width: 35,
    height: 25,
    zIndex: 1,
    position: 'absolute',
    top: 40, // Move flower higher in the container
  },
  playAgainButton: {
    backgroundColor: '#4169E1', // Royal blue button
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
