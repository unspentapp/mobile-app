import React from 'react';
import { View, StyleProp, ViewStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"

type Props = {
  isExpanded: boolean
  children?: React.ReactNode
  viewKey: string
  style?: StyleProp<ViewStyle>
  springConfig?: {
    damping?: number
    stiffness?: number
    mass?: number
  }
}

export const AccordionItem = ({
    isExpanded,
    children,
    viewKey,
    style,
    springConfig = {
      damping: 12,
      stiffness: 100,
      mass: 1
    },
  }: Props) => {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withSpring(height.value * Number(isExpanded), {
      damping: springConfig.damping,
      stiffness: springConfig.stiffness,
      mass: springConfig.mass,
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
}

const $animatedView: ViewStyle = {
  width: '100%',
  overflow: 'hidden',
}