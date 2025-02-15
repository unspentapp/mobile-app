import Animated, {
  FadeIn,
  interpolateColor, LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import React, { useEffect } from "react"
import { colors, spacing, typography } from "app/theme"
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native"

interface YearTabProps {
  key: number,
  year: number,
  isSelected: boolean,
  onPress: () => void
}

export const YearTab = ({ year, isSelected, onPress } : YearTabProps) => {
  const animationProgress = useSharedValue(0)

  useEffect(() => {
    animationProgress.value = withSpring(isSelected ? 1 : 0, { duration: 300 })
  }, [isSelected])

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: animationProgress.value,
      transform: [{ scaleX: animationProgress.value }]
    }
  })

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        animationProgress.value,
        [0, 1],
        [colors.textDim, colors.palette.primary500]
      )
    }
  })

  return (
    <Animated.View
      entering={FadeIn}
      layout={LinearTransition.springify()}
    >
      <TouchableOpacity
        style={$yearTab}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Animated.Text
          style={[
            $yearTabText,
            textStyle
          ]}
        >
          {year}
        </Animated.Text>

        <Animated.View
          style={[
            $tabIndicator,
            indicatorStyle
          ]}
        />
      </TouchableOpacity>
    </Animated.View>
  )
}

const $yearTab: ViewStyle = {
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  marginRight: spacing.lg,
  alignItems: 'center',
  justifyContent: 'center',
}

const $yearTabText: TextStyle = {
  fontFamily: typography.primary.medium,
  fontSize: 16,
}

const $tabIndicator: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 2,
  backgroundColor: colors.palette.primary500,
}