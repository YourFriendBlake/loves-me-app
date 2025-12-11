// App.tsx
import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, ScrollView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ZodiacSign } from './Types';
import { generatePetalCount } from './Utils/flowerUtils';

// Components
import ZodiacSelector from './components/ZodiacSelector';
import Flower from './components/Flower';
import ResultScreen from './components/ResultScreen';

export default function App() {
  // Game states
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'result'>('setup');
  
  // User inputs
  const [crushName, setCrushName] = useState('');
  const [userSign, setUserSign] = useState<ZodiacSign | undefined>(undefined);
  const [crushSign, setCrushSign] = useState<ZodiacSign | undefined>(undefined);
  
  // Game variables
  const [petalCount, setPetalCount] = useState(0);
  const [result, setResult] = useState(false);
  
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
          <TextInput
            style={styles.input}
            placeholder="Their name"
            placeholderTextColor="#999"
            value={crushName}
            onChangeText={setCrushName}
          />
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
  );
  
  const renderGameScreen = () => (
    <View style={styles.gameContainer}>
      <Flower
        petalCount={petalCount}
        name={crushName}
        userSign={userSign}
        crushSign={crushSign}
        onComplete={handleGameComplete}
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
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        
        {gameState === 'setup' && renderSetupScreen()}
        {gameState === 'playing' && renderGameScreen()}
        {gameState === 'result' && renderResultScreen()}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5', // Light pink background
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
    color: '#FF69B4',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FF69B4',
    opacity: 0.8,
  },
  inputSection: {
    marginBottom: 20,
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
    color: '#FF69B4',
    opacity: 0.9,
  },
  startButton: {
    backgroundColor: '#FFB6C1', // Light pink button
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30,
    shadowColor: '#FFB6C1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#FFD1DC', // Lighter pink for disabled state
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
    backgroundColor: '#FFF0F5', // Light pink background
  },
  input: {
    borderWidth: 2,
    borderColor: '#FFB6C1',
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#333',
  },
});