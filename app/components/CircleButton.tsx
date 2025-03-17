import React, { FC } from "react"
import { Dimensions, ImageStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { colors, typography } from "app/theme"
import { Icon } from "app/components/Icon"
import { transform } from "@babel/core"
import { opacity } from "react-native-reanimated/lib/typescript/Colors"

const { width } = Dimensions.get("screen")

interface CircleButtonProps {
  scrollX: SharedValue<number>,
  totalSize: number,
  onNext: () => void,
  style?: ViewStyle,
}

const CircleButton: FC<CircleButtonProps> = ({
  onNext,
  scrollX,
  totalSize,
  style = {},
  }) => {

  const isPressed = useSharedValue(false)
  const rippleScale = useSharedValue(0)
  const imageScale = useSharedValue(1)
  const imageOpacity = useSharedValue(1)

  const buttonAnimationStyle = useAnimatedStyle(() => ({
    transform: [{scale: withSpring(isPressed.value ? 0.9 : 1)}],
      opacity: withSpring(isPressed.value ? 0.9 : 1)
  }))

/*  const rippleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: rippleScale.value],
    opacity: rippleScale.value > 0 ? withTiming(0.3) : 0
  }))

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: withSpring(imageScale.value)}],
    opacity: withSpring(imageScale.value, {duration: 200})
  }))*/

  const handlePressIn = () => {
    isPressed.value = true;
    // (rippleScale.value = withTiming(1.5, {duration: 300})), (imageScale.value = 0.8)
    imageScale.value = 0.8
    imageOpacity.value = 0.7
  }

  const handlePressOut = () => {
    isPressed.value = false;
    // (rippleScale.value = 0), (imageScale.value = 1)
    imageScale.value = 1
    imageOpacity.value = 1
    onNext()
  }

  return (
    <View style={[$container, style]}>
      <Animated.View style={[$buttonContainer, buttonAnimationStyle]}>
        <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} style={$button}>
            <Animated.View style={$ripple} />
            <Icon icon={"caretRight"} size={typography.iconSize} color={colors.text}/>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default CircleButton

const $container: ViewStyle = {
  position: 'absolute',
  bottom: 60,
  alignSelf: 'center',
}

const $buttonContainer: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}

const $button: ViewStyle = {
  height: 55,
  width: 55,
  borderRadius: 35,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: colors.palette.primary500,
  overflow: "hidden",
  elevation: 5,
  shadowColor: colors.palette.neutral000,
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
}

const $image: ImageStyle = {
  height: 10,
  width: 10,
  tintColor: colors.palette.neutral000,
}

const $ripple: ViewStyle = {
  position: "absolute",
  width: 70,
  height: 70,
  borderRadius: 35,
  backgroundColor: colors.background,
}