import React from "react"
import { TextStyle, View } from "react-native"
import { Text } from "app/components/Text"
import { colors, spacing } from "app/theme"

// todo make a reusable component (see Button)
export const Tag = () => {
  return (
    <View style={$tagContainer}>
      <Text
        style={$tagText}
      >Text</Text>
    </View>
  )
}


const $tagContainer = {
  paddingHorizontal: spacing.sm,
  paddingVertical: 4,
  borderWidth: 1,
  borderColor: colors.palette.neutral400,
  borderRadius: 8,
}

const $tagText: TextStyle = {
  color: colors.palette.neutral400,
}