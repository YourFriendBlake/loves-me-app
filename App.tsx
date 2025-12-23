// App.tsx
import React, { useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, ScrollView, TextInput, Image, ImageBackground, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ZodiacSign } from './Types';
import { generatePetalCount } from './Utils/flowerUtils';

// Components
import ZodiacSelector from './components/ZodiacSelector';
import Flower from './components/Flower';
import ResultScreen from './components/ResultScreen';
import ImageText from './components/ImageText';

export default function App() {
  // Ref for hidden name input so tapping the paper can focus it
  const nameInputRef = useRef<TextInput | null>(null);
  
  // Animated value for press effect on name paper
  const namePaperScale = useRef(new Animated.Value(1)).current;
  
  // Calculate dynamic letter height based on name length
  // Start large (45) for short names, scale down as name gets longer
  const getLetterHeight = (text: string): number => {
    const textLength = text.length;
    const containerWidth = 188; // 220 (container) - 32 (padding: 16*2)
    const letterSpacing = -4;
    const letterAspectRatio = 0.8; // width is 80% of height
    
    // Start with larger size for short names
    let baseHeight = 45;
    
    // Calculate if text would overflow
    for (let height = baseHeight; height >= 25; height -= 1) {
      const letterWidth = height * letterAspectRatio;
      const totalWidth = textLength * (letterWidth + letterSpacing);
      
      if (totalWidth <= containerWidth) {
        return height;
      }
    }
    
    // Minimum size
    return 25;
  };
  
  // Game states
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'result'>('setup');
  
  // User inputs
  const [crushName, setCrushName] = useState('');
  const [userSign, setUserSign] = useState<ZodiacSign | undefined>(undefined);
  const [crushSign, setCrushSign] = useState<ZodiacSign | undefined>(undefined);
  
  // Game variables
  const [petalCount, setPetalCount] = useState(0);
  const [result, setResult] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true); // Sound on by default
  
  const startGame = () => {
    if (crushName.trim() === '') {
      alert('Please enter a name');
      return;
    }
    
    // Generate random petal count
    const count = generatePetalCount();
    setPetalCount(count);
    setGameState('playing');
  };
  
  const handleGameComplete = (gameResult: boolean) => {
    setResult(gameResult);
    setGameState('result');
  };
  
  const resetGame = () => {
    setCrushName('');
    setUserSign(undefined);
    setCrushSign(undefined);
    setPetalCount(0);
    setResult(false);
    setGameState('setup');
  };
  
  const renderSetupScreen = () => (
    <View style={styles.setupScreenContainer}>
      {/* Sound icon button in top right */}
      <TouchableOpacity
        style={styles.soundIconButton}
        onPress={() => setSoundEnabled(!soundEnabled)}
      >
        <Image
          source={require('./assets/SoundIcon.png')}
          style={[styles.soundIcon, !soundEnabled && styles.soundIconOff]}
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.setupContainer}>
          <View style={styles.headerSection}>
          <Text style={styles.title}>Loves Me, Loves Me Not</Text>
          <Text style={styles.subtitle}>Find out if your crush loves you!</Text>
          </View>
          
          <View style={styles.inputSection}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => nameInputRef.current?.focus()}
              onPressIn={() => {
                Animated.spring(namePaperScale, {
                  toValue: 0.95,
                  useNativeDriver: true,
                  tension: 300,
                  friction: 10,
                }).start();
              }}
              onPressOut={() => {
                Animated.spring(namePaperScale, {
                  toValue: 1,
                  useNativeDriver: true,
                  tension: 300,
                  friction: 10,
                }).start();
              }}
            >
              <Animated.View
                style={[
                  styles.namePaperContainer,
                  { transform: [{ scale: namePaperScale }] }
                ]}
              >
                <ImageBackground
                  source={require('./assets/Torn-Paper.png')}
                  style={styles.namePaper}
                  imageStyle={styles.namePaperImage}
                >
                <View style={styles.namePaperContent}>
                  {/* Display the name using custom letter images as the main visual */}
                  <View style={styles.nameDisplay}>
                    <ImageText 
                      text={crushName.trim() === '' ? 'Write' : crushName.toUpperCase()} 
                      letterHeight={getLetterHeight(crushName.trim() === '' ? 'Write' : crushName.toUpperCase())}
                      letterSpacing={-4}
                      fallbackStyle={styles.nameDisplayText}
                    />
                  </View>
                  {/* Invisible TextInput overlay to capture typing while using the paper as the visual */}
                  <TextInput
                    ref={nameInputRef}
                    style={styles.hiddenInput}
                    placeholder="Their name"
                    placeholderTextColor="transparent"
                    value={crushName}
                    onChangeText={setCrushName}
                    maxLength={20}
                    autoCorrect={false}
                    autoCapitalize="words"
                  />
                </View>
              </ImageBackground>
              </Animated.View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.zodiacSection}>
          <Text style={styles.optionalTitle}>Optional: Add Astrological Compatibility</Text>
          
          <ZodiacSelector
            title="Your Sign"
            selectedSign={userSign}
            onSelect={setUserSign}
          />
          
          <ZodiacSelector
            title="Their Sign"
            selectedSign={crushSign}
            onSelect={setCrushSign}
          />
          </View>
          
          <TouchableOpacity 
          style={[
            styles.startButton, 
            crushName.trim() === '' && styles.disabledButton
          ]} 
          onPress={startGame}
          disabled={crushName.trim() === ''}
        >
          <Text style={styles.startButtonText}>Start Picking Petals</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
  
  const renderGameScreen = () => (
    <View style={styles.gameContainer}>
      <Flower
        petalCount={petalCount}
        name={crushName}
        userSign={userSign}
        crushSign={crushSign}
        onComplete={handleGameComplete}
        soundEnabled={soundEnabled}
      />
    </View>
  );
  
  const renderResultScreen = () => (
    <ResultScreen
      result={result}
      name={crushName}
      userSign={userSign}
      crushSign={crushSign}
      onPlayAgain={resetGame}
    />
  );
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require('./assets/SkyBlueBackground.png')}
        style={styles.background}
        resizeMode="cover"
        imageStyle={{ transform: [{ scale: 1.15 }] }}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          
          {gameState === 'setup' && renderSetupScreen()}
          {gameState === 'playing' && (
            <View style={styles.gameScreenContainer}>
              {/* Sound icon button in top right for game screen too */}
              <TouchableOpacity
                style={styles.soundIconButton}
                onPress={() => setSoundEnabled(!soundEnabled)}
              >
                <Image
                  source={require('./assets/SoundIcon.png')}
                  style={[styles.soundIcon, !soundEnabled && styles.soundIconOff]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              {renderGameScreen()}
            </View>
          )}
          {gameState === 'result' && renderResultScreen()}
        </SafeAreaView>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  setupScreenContainer: {
    flex: 1,
    position: 'relative',
  },
  gameScreenContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  setupContainer: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: '100%',
  },
  headerSection: {
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#4169E1', // Royal blue
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4169E1',
    opacity: 0.8,
  },
  inputSection: {
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  namePaperContainer: {
    width: 400,
    alignSelf: 'center',
  },
  namePaper: {
    width: '100%',
    aspectRatio: 2.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  namePaperImage: {
    resizeMode: 'contain',
  },
  namePaperContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    width: '100%',
    paddingVertical: 8,
  },
  nameDisplayText: {
    color: '#4169E1',
    fontWeight: 'bold',
    fontSize: 35,
    textAlign: 'center',
  },
  hiddenInput: {
    // Invisible but tappable input layered over the paper to capture typing
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    // Ensure there's a measurable size for touch/keyboard focus
    height: '100%',
    width: '100%',
  },
  zodiacSection: {
    marginBottom: 20,
  },
  optionalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
    color: '#4169E1',
    opacity: 0.9,
  },
  startButton: {
    backgroundColor: '#4169E1', // Royal blue button
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30,
    shadowColor: '#4169E1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#9BB4F7', // Lighter blue for disabled state
  },
  startButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Let the Flower screen control its own background image
    backgroundColor: 'transparent',
  },
  input: {
    borderWidth: 2,
    borderColor: '#4169E1',
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#333',
    width: '100%',
    maxWidth: '100%',
  },
  soundIconButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundIcon: {
    width: 24,
    height: 24,
  },
  soundIconOff: {
    opacity: 0.4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});