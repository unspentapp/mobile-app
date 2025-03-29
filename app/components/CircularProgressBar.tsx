import React from 'react'
import Svg, { Circle, G } from 'react-native-svg'
import { View, ViewStyle } from 'react-native'
import { colors } from "app/theme"
import Animated, {
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
   * @default colors.custom.color1
   */
  innerCircleColor?: keyof typeof colors.custom
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
  innerCircleColor = "color1",
  delay = 0,
  springConfig = {
    damping: 20,
    stiffness: 100,
    mass: 1
  }
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage))

  const radius = (diameter - thickness) / 2
  const center = diameter / 2
  const circumference = radius * 2 * Math.PI
  const categoryColorKey = innerCircleColor;
  console.log(categoryColorKey + ' , ' + colors.custom[categoryColorKey])

  const derivedProgressValue = useDerivedValue(() => {
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

          {/* todo: add icon. Inner category icon circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius - 4}
            fill={colors.custom[categoryColorKey]}
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