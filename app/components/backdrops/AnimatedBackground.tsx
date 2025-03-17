import React, { useMemo } from "react"
import { useWindowDimensions, View, ViewStyle } from "react-native"
import randomColor from "randomcolor"
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { BlurView } from "@react-native-community/blur"
import { colors } from "app/theme"


function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min
}


type AnimatedBackgroundProps = {
  count: number,
  hue?: string,
  intensity?: number,
  customColors?: string[],
  duration?: number,
  backgroundColor?: string,
}

type CircleElementProps = {
  x: number
  y: number
  radius: number
  index: number
  color: string
}

type CircleProps = {
  circle: CircleElementProps,
  duration?: number,
}

const AnimatedBackground = ({
                              count,
                              hue,
                              intensity = 100,
                              customColors,
                              backgroundColor = colors.background,
                              duration
  } : AnimatedBackgroundProps) => {
  const { width, height } = useWindowDimensions()

  const circles = useMemo<CircleElementProps[]>(() => {
    const _colors = customColors ?? randomColor({
      count: 5,
      hue,
      luminosity: 'light',
      format: 'rgba',
      alpha: 0.5,
    })

    return _colors.map((color : string, index: number) => {
      const random = randomNumber(4, 10) / 10
      const radius = (width * random) / 2
      return {
        x: Math.random() * (width - radius * 2),
        y: Math.random() * (height - radius * 2),
        radius,
        index,
        color,
      }
    })
  }, [count, hue])

  return (
    <View style={[$screenWrapper, { backgroundColor }]}>
      {circles.map((circle) => {
        return (
          <Circle
            key={`circle-${circle.index}`}
            circle={circle}
            duration={duration}
          />
        )
      })}
     <BlurView
      style={$screenWrapper}
      blurAmount={intensity}
      blurType="light"
      blurRadius={25}
      // overlayColor={"#00000000"}
      />
    </View>
  )
}

function Circle({ circle, duration = 25000 } : CircleProps) {
  const randRotation = Math.random() * 360
  const rotation = useDerivedValue(() => {
    return withRepeat(
      withSequence(
        withTiming(randRotation, {duration: 0}),
        withTiming(randRotation + 360, {
          duration,
          easing: Easing.linear,
        }),
    ),
      -1, // infinity
      false, // no reverse
      )
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`
        }
      ]
    }
  })

  return (
    <Animated.View
      style={[
        $screenWrapper,
        animatedStyle,
        {
          transformOrigin: ["50%", circle.y, 0],
        }
      ]}>
      <View style={[$circleContainer, $circle,
        {
          backgroundColor: circle.color,
          left: circle.x - circle.radius,
          top: circle.y - circle.radius,
          width: circle.radius * 2,
          height: circle.radius * 4,
          borderRadius: circle.radius,
        }]}
      />
    </Animated.View>
  )
}

export default AnimatedBackground

const $screenWrapper: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
}

const $circleContainer: ViewStyle = {
  width: 100,
  height: 100,
  borderRadius: 50,
}

const $circle: ViewStyle = {
  position: 'absolute',
}