import React from "react"
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native"
import { Text } from "app/components/Text"
import { colors, spacing, typography } from "app/theme"


type TagProps = {
  id: string,
  label: string,
  color: keyof typeof colors.custom,
  onSelect: () => void,
  isSelected: boolean,
}


export const Tag = ({ id, label, color, onSelect, isSelected }: TagProps) => {

  return (
    <TouchableOpacity
      id={id}
      style={ isSelected ? [$selectedTagContainer, { backgroundColor: colors.custom[color], borderColor: colors.custom[color] }] : $tagContainer}
      onPress={onSelect}
    >
      <Text
        style={ isSelected ? $selectedTagText : $tagText} /* todo fix text of white bg */

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
  borderRadius: spacing.xxs,
}

const $tagText: TextStyle = {
  color: colors.palette.neutral400,
}

const $selectedTagText: TextStyle = {
  fontFamily: typography.primary.medium,
  color: colors.palette.neutral000,
}