import React from 'react';
import { StyleSheet, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PetalProps {
  angle: number;
  onRemove: () => void;
  index: number;
  isRemoved: boolean;
}

const Petal: React.FC<PetalProps> = ({ angle, onRemove, index, isRemoved }) => {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const isActive = useSharedValue(false);
  
  // Convert angle to radians for calculations
  const angleRad = (angle * Math.PI) / 180;
  
  // Calculate the direction vector
  const directionX = Math.sin(angleRad);
  const directionY = -Math.cos(angleRad);
  
  // Calculate the distance to move (enough to go off screen)
  const distance = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 1.5;
  
  // Calculate the base position for the petal
  const baseTranslateX = 100;
  const baseTranslateY = 0;
  
  React.useEffect(() => {
    if (isRemoved) {
      try {
        opacity.value = withTiming(0, { 
          duration: 500,
          easing: Easing.ease
        });
        
        translateX.value = withTiming(directionX * distance, {
          duration: 400,
          easing: Easing.ease
        });
        
        translateY.value = withTiming(directionY * distance, {
          duration: 400,
          easing: Easing.ease
        });
      } catch (error) {
        console.error('Error in removal animation:', error);
      }
    }
  }, [isRemoved]);
  
  const handleRemove = () => {
    try {
      onRemove();
    } catch (error) {
      console.error('Error in handleRemove:', error);
    }
  };
  
  const gesture = Gesture.Pan()
    .onBegin(() => {
      if (isRemoved) return;
      isActive.value = true;
      isDragging.value = true;
      opacity.value = withTiming(0.7);
    })
    .onUpdate((e) => {
      if (isRemoved || !isActive.value) return;
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (isRemoved || !isActive.value) return;
      isDragging.value = false;
      isActive.value = false;
      
      try {
        const dragDistance = Math.sqrt(
          e.translationX * e.translationX + 
          e.translationY * e.translationY
        );
        
        if (dragDistance > 100) {
          runOnJS(handleRemove)();
        } else {
          opacity.value = withTiming(1);
          translateX.value = withSpring(0, {
            damping: 15,
            stiffness: 100
          });
          translateY.value = withSpring(0, {
            damping: 15,
            stiffness: 100
          });
        }
      } catch (error) {
        console.error('Error in gesture end handler:', error);
        opacity.value = withTiming(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    })
    .onFinalize(() => {
      isActive.value = false;
      isDragging.value = false;
    });
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { rotate: `${angle}deg` },
        { translateX: baseTranslateX + translateX.value },
        { translateY: baseTranslateY + translateY.value }
      ]
    };
  });
  
  const imageStyle = {
    transform: [{ rotate: '45deg' }]
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.petalContainer, animatedStyle]}>
        <Image 
          source={require('../assets/Petal.png')}
          style={[styles.petalImage, imageStyle]}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  petalContainer: {
    position: 'absolute',
    width: 720,
    height: 315,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petalImage: {
    width: 378,
    height: 162,
  },
});

export default Petal;
