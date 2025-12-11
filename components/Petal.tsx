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
  center: { x: number; y: number };
  radius: number;
}

const Petal: React.FC<PetalProps> = ({ angle, onRemove, index, isRemoved, center, radius }) => {
  const opacity = useSharedValue(1);
  // Source image & base pivot (already used)
  const PETAL_W = 531;
  const PETAL_H = 1302;
  const ANCHOR_X = 312;
  const ANCHOR_Y = 1290;

  // NEW: tip location (outer edge) inside the image, in pixels.
  // X ≈ centered, Y ≈ near the top purple apex.
  const TIP_X = Math.round(PETAL_W / 2); // ~266
  const TIP_Y = 34;                      // tweak 28–42 to match your scan

  // Scale so the petal fits the radius
  const FARTHEST_PX = Math.max(ANCHOR_X, PETAL_W - ANCHOR_X, ANCHOR_Y, PETAL_H - ANCHOR_Y);
  const SCALE = Math.min(0.8, Math.max(0.05, (radius * 0.9) / FARTHEST_PX)) * 2;

  // image placement (base pixel at (0,0) of the pivot view)
  const imgW = PETAL_W * SCALE;
  const imgH = PETAL_H * SCALE;
  const imgLeft = -ANCHOR_X * SCALE;
  const imgTop = -ANCHOR_Y * SCALE;

  // NEW: tip position relative to the pivot (in the same local space)
  const tipOffsetX = (TIP_X - ANCHOR_X) * SCALE;
  const tipOffsetY = (TIP_Y - ANCHOR_Y) * SCALE;

  // Point the petal tip away from the center
  const ORIENTATION_OFFSET_DEG = 90;

  // --- Base world position inside the flower container ---
  const angleRad = (angle * Math.PI) / 180;
  const baseX = center.x + Math.cos(angleRad) * radius;
  const baseY = center.y + Math.sin(angleRad) * radius;
  const translateX = useSharedValue(baseX);
  const translateY = useSharedValue(baseY);
  const rotation = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const isActive = useSharedValue(false);
  const isFalling = useSharedValue(false);

  // Re-center if angle/center/radius change
  React.useEffect(() => {
    translateX.value = baseX;
    translateY.value = baseY;
  }, [baseX, baseY]);

  React.useEffect(() => {
    if (isRemoved && !isFalling.value) {
      // If removed by external trigger (not by dragging), use original animation
      isFalling.value = true;
      // Call onRemove for external removals too
      handleRemove();
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
    if (isFalling.value) return; // Prevent multiple calls
    isFalling.value = true;
    
    // Register removal when petal starts falling
    // This ensures removal is tracked even if called from different places
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
    .hitSlop({ top: 16, bottom: 16, left: 16, right: 16 })
    .activeOffsetX([-5, 5])
    .activeOffsetY([-5, 5])
    .onBegin((e) => {
      if (isRemoved || isFalling.value) return;
      
      // Cancel any existing animations
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(rotation);
      
      isActive.value = true;
      isDragging.value = true;
      
      // Bring this petal to front when activated
      // Slight visual feedback when starting to drag
      opacity.value = withTiming(0.85, { duration: 100 });
    })
    .onUpdate((e) => {
      if (isRemoved || !isActive.value || isFalling.value) return;
      
      // Drag relative to base world position
      translateX.value = baseX + e.translationX;
      translateY.value = baseY + e.translationY;
      
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
          // startFallingAnimation will call triggerRemoveCallback
          startFallingAnimation();
        } else {
          // Snapped back - return to origin with spring
          opacity.value = withTiming(1, { duration: 200 });
          rotation.value = withSpring(0, {
            damping: 20,
            stiffness: 150
          });
          translateX.value = withSpring(baseX, {
            damping: 15,
            stiffness: 120
          });
          translateY.value = withSpring(baseY, {
            damping: 15,
            stiffness: 120
          });
        }
      } catch (error) {
        console.error('Error in gesture end handler:', error);
        opacity.value = withTiming(1);
        translateX.value = withSpring(baseX);
        translateY.value = withSpring(baseY);
        rotation.value = withSpring(0);
      }
    })
    .onFinalize(() => {
      if (!isFalling.value) {
        isActive.value = false;
        isDragging.value = false;
      }
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    zIndex: isDragging.value ? 1000 : index + 10,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${angle + rotation.value + ORIENTATION_OFFSET_DEG}deg` },
    ],
  }));

  return (
    <Animated.View style={styles.petalContainer} pointerEvents={isRemoved ? 'none' : 'box-none'}>
      {/* Pivot (base) – this view is transformed and rotated */}
      <Animated.View style={[styles.pivot, animatedStyle]} pointerEvents="box-none">
        {/* The bitmap, offset so its base pixel is at the pivot (0,0) */}
        <Image
          source={require('../assets/Petal.png')}
          style={{ position:'absolute', width: imgW, height: imgH, left: imgLeft, top: imgTop }}
          resizeMode="contain"
        />

        {/* >>> Transparent grab handle at the TIP <<< */}
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              styles.tipGrab,
              {
                left: tipOffsetX - 60, // center the 120x120 box on the tip
                top:  tipOffsetY - 60,
                width: 120,
                height: 120,
              },
            ]}
            pointerEvents="auto"
          />
        </GestureDetector>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  petalContainer: { ...StyleSheet.absoluteFillObject, pointerEvents: 'box-none' },

  // Pivot (base) – the view that is translated/rotated
  pivot: {
    position: 'absolute',
    width: 1,
    height: 1,
    left: -0.5,
    top: -0.5,
  },

  // Transparent touch area placed at the petal TIP
  tipGrab: {
    position: 'absolute',
    borderRadius: 60,
    // optional: uncomment to debug the area
    // backgroundColor: 'rgba(0,255,0,0.15)',
  },
});

export default Petal;
