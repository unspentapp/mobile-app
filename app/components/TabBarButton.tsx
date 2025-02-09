import React from "react"
import { colors, spacing, typography } from "app/theme"
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native"
import { Icon, IconTypes } from "app/components/Icon"
import { Text } from "./Text"

type Props = {
  label: string,
  icon: IconTypes,
  onPress: () => void,
  isFocused: boolean,
}

const TabBarButton = ({ label, icon, onPress, isFocused } : Props) => {

  return (
    <TouchableOpacity
      onPress={onPress}
      style={$button}
    >
      <Icon
        icon={icon}
        size={typography.iconSize}
        color={isFocused ? colors.text : colors.textDim}
      />
      <Text style={[$buttonLabel, { color: isFocused ? colors.text : colors.textDim }]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export default TabBarButton

const $button: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xs,
  gap: spacing.xs,
}

const $buttonLabel: TextStyle = {
  fontFamily: typography.primary.medium
}