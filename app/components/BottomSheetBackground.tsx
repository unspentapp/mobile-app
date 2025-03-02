import { StyleProp, View, ViewStyle } from "react-native"
import React from "react"
import { colors, spacing } from "app/theme"

// @ts-ignore
export const BottomSheetBackground = ({style}: StyleProp<ViewStyle>) => {
  return (
    <View
      style={[$customStyle, {...style},]}
    />)
}

const $customStyle: ViewStyle = {
  borderWidth: 0,
  borderRadius: spacing.sm,
  backgroundColor: colors.background,
}