import React, { FC } from "react"
import Animated, { interpolateColor, SharedValue, useAnimatedStyle } from "react-native-reanimated"
import { Dimensions, ViewStyle } from "react-native"

const { width } = Dimensions.get("screen")

const BGS = ["#fbbc24", "#52ccbc", "#F953B2", "#fbbc24"]

type BackdropProps = {
  scrollX: SharedValue<number>
}

const Backdrop: FC<BackdropProps> = ({ scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollX.value,
      BGS.map((_,i) => i * width),
      BGS
    )

    return {
      backgroundColor,
      opacity: 0.7,
    }
  })

  return (
    <Animated.View style={[$absoluteFill, animatedStyle]}>
      
    </Animated.View>
  )
}

export default Backdrop

const $absoluteFill: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
}