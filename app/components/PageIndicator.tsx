import React, { FC } from "react"
import { Dimensions, View } from "react-native"
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated"
import { colors } from "app/theme"

const { width } = Dimensions.get("screen")

interface IndicatorProps {
  scrollX: SharedValue<number>,
  data: any[]
}

const PageIndicator: FC<IndicatorProps> = ({ data, scrollX }) => {



  return (
    <View style={{
      position: "absolute",
      bottom: 100,
      flexDirection: "row",
    }}>
      {data.map((_, i) => {

        const inputRange = [(i - 1) * width, i * width, (i + 1) * width]

        const animatedStyle = useAnimatedStyle(() => {
          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.6, 0.9, 0.6],
            Extrapolation.CLAMP
          )

          const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.8, 1.4, 0.8],
            Extrapolation.CLAMP
          )

          return {
            opacity,
            transform: [{scale}]
          }
        })

        return (
          <Animated.View
            key={`indicator-${i}`}
            style={[
              animatedStyle,
              {
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: colors.background,
              margin: 10,
          }]}
          />
        )
      })}
    </View>
  )
}

export default PageIndicator