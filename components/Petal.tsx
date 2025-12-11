import React from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  withDecay,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
  cancelAnimation
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
  // Petal distance from the center of the flower
  const RADIUS = 100;

  // Convert angle (deg) to radians
  const angleRad = (angle * Math.PI) / 180;

  // Base world position of the petal BEFORE dragging
  const baseTranslateX = Math.cos(angleRad) * RADIUS;
  const baseTranslateY = Math.sin(angleRad) * RADIUS;
  
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(baseTranslateX);
  const translateY = useSharedValue(baseTranslateY);
  const rotation = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const isActive = useSharedValue(false);
  const isFalling = useSharedValue(false);
  
  React.useEffect(() => {
    translateX.value = baseTranslateX;
    translateY.value = baseTranslateY;
    // reset rotation/opacity if needed
  }, [baseTranslateX, baseTranslateY]);

  React.useEffect(() => {
    if (isRemoved && !isFalling.value) {
      // If removed by external trigger (not by dragging), use original animation
      isFalling.value = true;
      opacity.value = withTiming(0, { 
        duration: 500,
        easing: Easing.ease
      });
    }
  }, [isRemoved]);
  
  const handleRemove = () => {
    try {
      onRemove();
    } catch (error) {
      console.error('Error in handleRemove:', error);
    }
  };

  const triggerRemoveCallback = () => {
    'worklet';
    runOnJS(handleRemove)();
  };

  const startFallingAnimation = () => {
    'worklet';
    isFalling.value = true;
    
    // Register removal immediately when petal starts falling off screen
    triggerRemoveCallback();
    
    // Calculate current velocity from drag (simplified)
    const velocityX = translateX.value * 0.1;
    
    // Add rotation while falling (spinning effect)
    rotation.value = withDecay({
      velocity: Math.random() * 5 - 2.5, // Random rotation velocity between -2.5 and 2.5
      deceleration: 0.995,
      clamp: [0, 360]
    });
    
    // Horizontal decay (sideways movement)
    translateX.value = withDecay({
      velocity: velocityX,
      deceleration: 0.998,
      clamp: [-SCREEN_WIDTH * 2, SCREEN_WIDTH * 2]
    });
    
    // Gravity effect - accelerate downward
    // Calculate how far down the screen to fall
    const fallDistance = SCREEN_HEIGHT + 500; // Fall off screen with buffer
    const fallDuration = 1500 + Math.random() * 500; // Randomize fall time slightly
    
    translateY.value = withTiming(
      fallDistance,
      {
        duration: fallDuration,
        easing: Easing.bezier(0.33, 1, 0.68, 1), // Acceleration curve (gravity)
      }
    );
    
    // Fade out as it falls
    opacity.value = withSequence(
      withTiming(0.8, { duration: 200 }), // Slight fade
      withDelay(800, withTiming(0, { duration: 500 })) // Fade out near bottom
    );
  };
  
  const gesture = Gesture.Pan()
    .hitSlop({ top: 15, bottom: 15, left: 15, right: 15 }) // Extra padding for easier touch detection
    .activeOffsetX([-2, 2]) // Reduced threshold for more responsive activation
    .activeOffsetY([-2, 2])
    .onBegin(() => {
      if (isRemoved || isFalling.value) return;
      
      // Cancel any existing animations
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(rotation);
      
      isActive.value = true;
      isDragging.value = true;
      
      // Slight visual feedback when starting to drag
      opacity.value = withTiming(0.85, { duration: 100 });
    })
    .onUpdate((e) => {
      if (isRemoved || !isActive.value || isFalling.value) return;
      
      translateX.value = baseTranslateX + e.translationX;
      translateY.value = baseTranslateY + e.translationY;
      
      // Add slight rotation based on drag direction for realism
      const dragAngle = Math.atan2(e.translationY, e.translationX);
      rotation.value = (dragAngle * 180) / Math.PI * 0.3; // Scale rotation
    })
    .onEnd((e) => {
      if (isRemoved || !isActive.value || isFalling.value) return;
      
      isDragging.value = false;
      isActive.value = false;
      
      try {
        // Calculate drag distance from origin
        const dragDistance = Math.sqrt(
          e.translationX * e.translationX + 
          e.translationY * e.translationY
        );
        
        // Threshold for removal - if dragged far enough, make it fall
        if (dragDistance > 80) {
          // Petal was pulled far enough - start falling animation
          startFallingAnimation();
        } else {
          // Snapped back - return to origin with spring
          opacity.value = withTiming(1, { duration: 200 });
          rotation.value = withSpring(0, {
            damping: 20,
            stiffness: 150
          });
          translateX.value = withSpring(baseTranslateX, {
            damping: 15,
            stiffness: 120
          });
          translateY.value = withSpring(baseTranslateY, {
            damping: 15,
            stiffness: 120
          });
        }
      } catch (error) {
        console.error('Error in gesture end handler:', error);
        opacity.value = withTiming(1);
        translateX.value = withSpring(baseTranslateX);
        translateY.value = withSpring(baseTranslateY);
        rotation.value = withSpring(0);
      }
    })
    .onFinalize(() => {
      if (!isFalling.value) {
        isActive.value = false;
        isDragging.value = false;
      }
    });
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      zIndex: isDragging.value ? 1000 : index + 10, // Bring dragged petal to front
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${angle + rotation.value}deg` }, // Combine base angle with rotation
      ]
    };
  });
  
  const imageStyle = {
    transform: [{ rotate: '90deg' }]
  };

  return (
    <Animated.View 
      style={[styles.petalContainer, animatedStyle]}
      pointerEvents={isRemoved ? 'none' : 'box-none'}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View style={styles.touchableArea} pointerEvents="auto">
          <Image 
            source={require('../assets/Petal.png')}
            style={[styles.petalImage, imageStyle]}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  petalContainer: {
    position: 'absolute',
    width: 720,
    height: 720,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'box-none', // Allow touches to pass through empty areas
  },
  touchableArea: {
    width: 378, // Match petal image size exactly
    height: 162,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petalImage: {
    width: 378,
    height: 162,
  },
});

export default Petal;
