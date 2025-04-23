// App.tsx
import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, ScrollView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ZodiacSign } from './index';
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
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.setupContainer}>
        <Text style={styles.title}>Loves Me, Loves Me Not</Text>
        <Text style={styles.subtitle}>Find out if your crush loves you!</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Their name"
          value={crushName}
          onChangeText={setCrushName}
        />
        
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FF69B4', // Pink text
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#FF69B4', // Pink text
  },
  optionalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#FF69B4', // Pink text
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
    borderWidth: 1,
    borderColor: '#FFB6C1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: 'white',
  },
});