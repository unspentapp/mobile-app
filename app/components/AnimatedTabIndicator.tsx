import React, { Dispatch, useEffect, useState } from "react"
import { LayoutChangeEvent, View, ViewStyle } from "react-native"
import { colors, spacing } from "app/theme"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import TabBarButton from "app/components/TabBarButton"
import { IconTypes } from "app/components/Icon"

type TabIndicatorProps = {
  index: number,
  setIndex: Dispatch<React.SetStateAction<number>>
}

const AnimatedTabIndicator = ({ index, setIndex } : TabIndicatorProps) => {
  const [dimensions, setDimensions] = useState({ height: 40, width: 250 })

  const routes = [
    {
      index: 0,
      label: "New Expense",
      testID: "tabBarExpense",
      icon: "expense"
    },
    {
      index: 1,
      label: "New Income",
      testID: "tabBarIncome",
      icon: "income"
    },
  ]

  const buttonWidth = dimensions.width / routes.length

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    })
  }

  const tabPositionX = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: tabPositionX.value}]
    }
  })

  useEffect(() => {
    // Calculate position including margins/padding
    const newPosition = buttonWidth * index
    tabPositionX.value = withSpring(newPosition, {
      damping: 18,
      stiffness: 180,
      mass: 1
    })

  }, [index, buttonWidth])

  return (
    <View style={$container} onLayout={onTabbarLayout}>
      <Animated.View
        style={[$backgroundSplash, animatedStyle, {
          height: dimensions.height - 12,
          width: buttonWidth - 12 ,
        }]}
      />
      {routes.map((route, i) => {
        const isFocused = i === index;

        const onPress = () => {
          if (!isFocused) {
            setIndex(i)
          }
        };

        return (
          <TabBarButton
            key={i}
            icon={route.icon as IconTypes}
            label={route.label}
            onPress={onPress}
            isFocused={isFocused}
          />
        );
      })}
    </View>
  )
}

export default AnimatedTabIndicator

const $container: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: colors.palette.neutral000,
  marginHorizontal: spacing.md,
  paddingHorizontal: spacing.xxs,
  paddingVertical: spacing.xxs,
  borderRadius: spacing.xs,
  elevation: 4,
}

const $backgroundSplash: ViewStyle = {
  position: "absolute",
  left: 6,
  backgroundColor: colors.palette.primary500,
  borderRadius: spacing.xxs,
}