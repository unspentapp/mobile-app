import React from "react"
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native"
import { Text } from "app/components/Text"
import { colors, spacing, typography } from "app/theme"


type TagProps = {
  id: string,
  label: string,
  onSelect: () => void,
  isSelected: boolean,
}


export const Tag = ({ id, label, onSelect, isSelected }: TagProps) => {

  return (
    <TouchableOpacity
      id={id}
      style={ isSelected ? $selectedTagContainer : $tagContainer}
      onPress={onSelect}
    >
      <Text
        style={ isSelected ? $selectedTagText : $tagText}

      >{label}</Text>
    </TouchableOpacity>
  )
}


const $tagContainer: ViewStyle = {
  paddingHorizontal: spacing.sm,
  paddingVertical: 4,
  borderWidth: 1,
  borderColor: colors.palette.neutral400,
  borderRadius: spacing.xxs,
}

const $selectedTagContainer: ViewStyle = {
  paddingHorizontal: spacing.sm,
  paddingVertical: 4,
  borderWidth: 1,
  borderColor: colors.palette.primary500,
  borderRadius: spacing.xxs,
}

const $tagText: TextStyle = {
  color: colors.palette.neutral400,
}

const $selectedTagText: TextStyle = {
  color: colors.palette.primary500,
  fontFamily: typography.primary.medium,
}