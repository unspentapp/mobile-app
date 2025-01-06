import { StyleProp, View, ViewStyle } from "react-native"
import React from "react"
import { colors } from "app/theme"

export const BottomSheetBackground = ({style}: StyleProp<ViewStyle>) => {
  return (
    <View
      style={[$customStyle, {...style},]}
    />)
}

const $customStyle: ViewStyle = {
  borderWidth: 0,
  backgroundColor: colors.background,
}