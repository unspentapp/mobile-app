import React from 'react'
import Svg, { Circle, G } from 'react-native-svg'
import { View, ViewStyle } from 'react-native'
import { colors } from "app/theme"
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useDerivedValue,
  withSpring,
  withDelay, Extrapolation,
} from "react-native-reanimated"

type CircularProgressBarProps = {
  /**
   * Pre-calculated percentage (0-100)
   */
  percentage: number
  /**
   * Diameter of the circular progress bar
   * @default 100
   */
  diameter?: number
  /**
   * Thickness of the progress bar
   * @default 6
   */
  thickness?: number
  /**
   * Color of the base track
   * @default colors.palette.neutral200
   */
  trackColor?: string
  /**
   * Color of the progress
   * @default colors.palette.primary500
   */
  progressColor?: string
  /**
   * Color of the inner circle
   * @default colors.palette.primary100
   */
  innerCircleColor: keyof typeof colors.custom
  /**
   * Delay before animation starts (in milliseconds)
   * @default 0
   */
  delay?: number
  /**
   * Spring animation configuration
   */
  springConfig?: {
    damping?: number
    mass?: number
    stiffness?: number
    overshootClamping?: boolean
    restDisplacementThreshold?: number
    restSpeedThreshold?: number
  }
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  diameter = 52,
  thickness = 3,
  trackColor = colors.palette.neutral100,
  progressColor = colors.palette.primary500,
  innerCircleColor = colors.palette.primary100,
  delay = 0,
  springConfig = {
    damping: 20,
    stiffness: 100,
    mass: 1
  }
}) => {
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage))

  // Calculate radius and other SVG-specific measurements
  const radius = (diameter - thickness) / 2
  const center = diameter / 2
  const circumference = radius * 2 * Math.PI

  const derivedProgressValue = useDerivedValue(() => {
    // Use withDelay and withSpring for smooth animation with delay
    return withDelay(
      delay,
      withSpring(clampedPercentage, springConfig)
    );
  }, [clampedPercentage, delay, springConfig]);

  const circleAnimatedProps = useAnimatedProps(() => {
    const progress = interpolate(
      derivedProgressValue.value,
      [0, 100],
      [circumference, 0],
      Extrapolation.CLAMP
    );

    // Return the strokeDashoffset for the animated circle
    return {
      strokeDashoffset: progress,
    };
  });

  return (
    <View style={$container}>
      <Svg width={diameter} height={diameter}>
        <G rotation={-90} origin={`${center}, ${center}`}>
          {/* Background track circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={trackColor}
            strokeWidth={thickness}
          />

          {/* Progress circle */}
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={progressColor}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeLinecap="round"
            animatedProps={circleAnimatedProps}
          />

          <Circle
            cx={center}
            cy={center}
            r={radius - 4}
            fill={innerCircleColor}
          />
        </G>
      </Svg>
    </View>
  )
}

const $container: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
}