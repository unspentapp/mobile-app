import React, { useEffect, useState } from "react"
import { View, Text, ViewStyle, TextStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  withSpring,
  withDelay,
  useSharedValue
} from 'react-native-reanimated'
import { colors, spacing } from "app/theme"

type StatsCardProps = {
  numerator: number
  denominator: number
  /**
   * Delay in milliseconds before the animation starts
   * @default 0
   */
  animationDelay?: number
  /**
   * Spring animation configuration
   * @default { damping: 12, stiffness: 100 }
   */
  springConfig?: {
    damping?: number
    stiffness?: number
  }
}

export const ProgressBar = (props: StatsCardProps) => {
  const {
    numerator,
    denominator,
    animationDelay = 0,
    springConfig = {
      damping: 12,
      stiffness: 100
    }
  } = props

  const showProgressBar = denominator !== undefined
  const [containerWidth, setContainerWidth] = useState(0)

  // Calculate progress and percentage
  const progress = showProgressBar ? numerator / denominator : 0
  const percentage = Math.round(progress * 100)

  // Use shared value for animation
  const progressAnimation = useSharedValue(0)

  // Calculate progress width only if we have valid container width
  const targetWidth = (containerWidth > 0 && showProgressBar)
    ? containerWidth * progress
    : 0

  useEffect(() => {
    // Animate progress on mount with spring effect
    progressAnimation.value = withDelay(
      animationDelay,
      withSpring(targetWidth, {
        damping: springConfig.damping,
        stiffness: springConfig.stiffness,
        mass: 1,
        restDisplacementThreshold: 0.01,
      })
    )
  }, [targetWidth, animationDelay, springConfig])

  // Create animated style for progress bar
  const animatedStyle = useAnimatedStyle(() => ({
    width: progressAnimation.value,
  }))

  return (
    <View
      style={$container}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <View style={$progressBarContainer}>
        <Animated.View
          style={[
            $progressBar,
            animatedStyle
          ]}
        />
      </View>
      <View style={$content}>
        <Text style={$percentageText}> Spent: {numerator} € / {percentage}%</Text>
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  marginTop: spacing.sm,
  borderRadius: spacing.md,
  width: '100%',
}

const $content: ViewStyle = {
  padding: 8,
  flexDirection: 'row',
  gap: spacing.xxs,
  alignItems: 'center',
}

const $progressBarContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral200,
  height: 6,
  borderRadius: 2,
  width: '100%',
}

const $progressBar: ViewStyle = {
  height: 6,
  width: 0,
  backgroundColor: colors.palette.primary500,
  borderRadius: 2,
  shadowColor: colors.palette.neutral400,
  shadowOffset: {height: 0, width: 2},
}

const $percentageText: TextStyle = {
  fontSize: 14,
  color: colors.textDim,
}