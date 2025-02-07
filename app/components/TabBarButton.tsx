import React, { useEffect } from "react"
import { colors, spacing, typography } from "app/theme"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { Icon } from "app/components/Icon"
import { Text } from "./Text"

type Props = {

}

const TabBarButton = ({ label, icon, onPress, isFocused }) => {

  const scale = useSharedValue(0)

  /*useEffect(() => {
    scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 })
  }, [scale, isFocused])*/

  /*const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0])

    return { opacity }
  })*/
  /*const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2])

    const left = interpolate(scale.value, [0, 1], [0, 38])

    return {
      transform: [{
        scale: scaleValue
      }],
      left
    }
  })*/

  return (
    <TouchableOpacity
      onPress={onPress}
      style={$button}
    >

      <Icon
        icon={icon}
        size={typography.iconSize}
        color={isFocused ? colors.text : colors.textDim}
      />
      <Text style={[$buttonLabel, { color: isFocused ? colors.text : colors.textDim }]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export default TabBarButton

const $button: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xs,
  gap: spacing.xs,
}

const $buttonLabel: TextStyle = {
  fontFamily: typography.primary.medium
}