import React from 'react';
import { View, StyleProp, ViewStyle } from "react-native"
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { spacing } from "app/theme"

type Props = {
  isExpanded:  SharedValue<boolean>,
  children?: React.ReactNode,
  viewKey: string,
  style?: StyleProp<ViewStyle>,
  duration?: number,
}

export const AccordionItem = ({
   isExpanded,
   children,
   viewKey,
   style,
   duration = 500,
 }: Props) => {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[$animatedView, bodyStyle, style]}>
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={$wrapper}>
        {children}
      </View>
    </Animated.View>
  );
}

const $wrapper: ViewStyle = {
  position: "absolute",
  width: "100%",
  paddingTop: spacing.md,
}

const $animatedView: ViewStyle = {
  width: '100%',
  overflow: 'hidden',
}
