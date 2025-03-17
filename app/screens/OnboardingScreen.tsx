import React, { FC, useRef } from "react"
import { Dimensions, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"
import OnboardingContent, { OnboardingItem } from "assets/OnboardingContent"
import Backdrop from "app/components/backdrops/Backdrop"
import Circle from "app/components/backdrops/Circle"
import PageIndicator from "app/components/PageIndicator"
import CircleButton from "app/components/CircleButton"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("screen")

const OnboardingRenderItem: FC<{
  item: OnboardingItem;
  index: number;
  scrollX: SharedValue<number>
}> = ({index, item, scrollX}) => {

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index *  width,
      (index + 1) * width,
    ]

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    )

    const rotate = `${
      interpolate(
        scrollX.value,
        inputRange,
        [-15, 0, 15],
        Extrapolation.CLAMP,
      )}deg`

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    )

    return {
      opacity,
      transform: [{scale}, {rotate}]
    }
  })

  const animatedStyle = (translateOffset: number, skewOffset: number) => useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index *  width,
      (index + 1) * width,
    ]

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    )

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [translateOffset, 1, -translateOffset],
      Extrapolation.CLAMP,
    )

    const skewY = `${interpolate(
      scrollX.value,
      inputRange,
      [-skewOffset, 0, skewOffset],
      Extrapolation.CLAMP,
    )}deg`

    return {
      opacity,
      transform: [{translateY}, {skewY}]
    }
  })

  return (
    <View style={$itemContainer}>
      <View style={$imageContainer}>
        <Animated.Image
          source={item.image}
          style={[$image, imageAnimatedStyle]}
        />
      </View>
      <View style={$textContainer}>
        <Animated.Text style={[$title, animatedStyle(50, 10)]}>
          {item.title}
        </Animated.Text>
        <Animated.Text style={[$description, animatedStyle(30, 10)]}>
          {item.description}
        </Animated.Text>
      </View>
    </View>
  )
}




export const OnboardingScreen = () => {
  const navigation = useNavigation()
  const { top } = useSafeAreaInsets()
  const scrollX = useSharedValue(0)
  const flatlistRef = useRef<Animated.FlatList<OnboardingItem>>(null)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x
    }
  })

  const handleNext = () => {
    const currentIndex = Math.round(scrollX.value / width)

    if (currentIndex < OnboardingContent.length - 1) {
      flatlistRef.current?.scrollToIndex({index: currentIndex + 1})
    } else {
      navigation.navigate("Signup")
    }
  }

  return (
    <View style={$screenContainer}>
      <StatusBar hidden />
      <Backdrop scrollX={scrollX}/>
      <Circle scrollX={scrollX} data={OnboardingContent} />
      <Animated.FlatList
        ref={flatlistRef}
        data={OnboardingContent}
        keyExtractor={(item) => item.key.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        contentContainerStyle={$flatlistContainer}
        renderItem={({ item, index }) => (
          <OnboardingRenderItem item={item} index={index} scrollX={scrollX} />
        )}
      />
      <PageIndicator scrollX={scrollX} data={OnboardingContent}  />
      <CircleButton
        scrollX={scrollX}
        totalSize={OnboardingContent.length}
        onNext={handleNext}
        style={{
          right: 20,
          bottom: 50,
        }}
      />
    </View>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
  alignItems: "center"
}

const $flatlistContainer: ViewStyle = {
  paddingBottom: 100,
}

const $itemContainer: ViewStyle = {
  width,
  alignItems: "center",
}

const $imageContainer: ViewStyle = {
  flex: 0.7,
  justifyContent: "center",
}

const $image: ImageStyle = {
  width: width / 1.2,
  height: width / 1.2,
  resizeMode: "contain",
}

const $textContainer: ViewStyle = {
  flex: 0.3,
  paddingHorizontal: spacing.md,
}

const $title: TextStyle = {
  fontSize: 38,
  fontFamily: typography.primary.bold,
  color: colors.text,
  marginBottom: spacing.md,
  textAlign: "center",
}

const $description: TextStyle = {
  fontSize: 18,
  fontFamily: typography.primary.normal,
  color: colors.text,
  textAlign: "center",
}