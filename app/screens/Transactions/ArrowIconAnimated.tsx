import React from "react"
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated"
import { Icon } from "app/components"
import { colors } from "app/theme"
import { ViewStyle } from "react-native"

interface ArrowIconAnimatedProps {
  value: boolean
  springConfig?: {
    damping?: number
    stiffness?: number
    mass?: number
  }
}

const ArrowIconAnimated: React.FC<ArrowIconAnimatedProps> = ({
  value,
  springConfig = {
    damping: 15,
    stiffness: 200,
    mass: 1
  }
  }) => {
  const animatedIcon = useAnimatedStyle(() => ({
    transform: [{
      rotate: withSpring(
        value ? '-180deg' : '0deg',
        {
          damping: springConfig.damping,
          stiffness: springConfig.stiffness,
          mass: springConfig.mass
        }
      )
    }],
  }))

  return (
    <Animated.View style={[$style, animatedIcon]}>
      <Icon icon="arrowDown" color={colors.text} size={20} />
    </Animated.View>
  )
}

export default ArrowIconAnimated

const $style: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center'
}