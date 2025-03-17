import React, { FC } from "react"
import { Dimensions } from "react-native"
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated"

const { width, height } = Dimensions.get("screen")

const baseColors = ["#fbbc24", "#52ccbc", "#F953B2", "#fbbc24"]

interface ColorProps {
  scrollX: SharedValue<number>,
  data: any[]
}

const Circle: FC<ColorProps> = ({ data, scrollX}) => {
  const colors = baseColors.flatMap((color, index) =>
    index === 0 ? [color] : [color, color]
  )

  const inputRange = Array.from(
    { length: data.length * 2 - 1},
    (_, i) => i * (width / 2),
  )

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      Array.from({length: inputRange.length}, (_, i) =>i % 2 === 0 ? 1 : 0.1),
      Extrapolation.CLAMP
    )

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      Array.from({length: inputRange.length}, (_, i) => i % 2 === 0 ? 0.3 : 0),
      Extrapolation.CLAMP
    )

    const skewX = interpolate(
        scrollX.value,
        [0, (data.length - 1) * width],
        [0, 15],
        Extrapolation.CLAMP
    )

    const transformSkewX = `${skewX}deg`

    const colorIndex = Math.floor(
      interpolate(
        scrollX.value,
        [0, (data.length - 1) * width],
        [0, colors.length - 1],
        Extrapolation.CLAMP
      )
    )

    const backgroundColor = colors[colorIndex % colors.length]

    return {
      opacity,
      backgroundColor,
      transform: [{scale}, {skewX: transformSkewX}]
    }
  })


  return (
    <Animated.View
      style={[
        animatedStyle,
        {
        width: height * 1.2,
        height: height * 1.2,
        borderRadius: height * 1.2,
        top: -height * 0.6,
        left: -height * 0.6,
        position: "absolute",
      }
    ]}/>
  )
}

export default Circle