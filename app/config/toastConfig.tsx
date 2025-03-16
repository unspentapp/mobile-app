import React from 'react';
import { View, Text, ViewStyle, TextStyle } from "react-native"
import { Icon } from "app/components"
import { BaseToastProps } from 'react-native-toast-message';
import { colors, spacing, typography } from "app/theme"

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const toastConfig = {
  error: ({ text1, text2 }: CustomToastProps) => (
    <View style={[$container, $errorContainer]}>
      <Icon icon="ladybug" color={colors.error} size={typography.iconSize} />
      <View style={$textContainer}>
        {text1 && <Text style={[$text, $titleText, $errorText]}>{text1}</Text>}
        {text2 && <Text style={[$text, $messageText]}>{text2}</Text>}
      </View>
    </View>
  ),
  success: ({ text1, text2 }: CustomToastProps) => (
    <View style={[$container, $successContainer]}>
      <Icon icon="check" color={colors.success} size={typography.iconSize} />
      <View style={$textContainer}>
        {text1 && <Text style={[$text, $titleText, $successText]}>{text1}</Text>}
        {text2 && <Text style={[$text, $messageText]}>{text2}</Text>}
      </View>
    </View>
  ),
  info: ({ text1, text2 }: CustomToastProps) => (
    <View style={[$container, $infoContainer]}>
      <Icon icon="bell" color={colors.palette.primary500} size={typography.iconSize} />
      <View style={$textContainer}>
        {text1 && <Text style={[$text, $titleText, $infoText]}>{text1}</Text>}
        {text2 && <Text style={[$text, $messageText]}>{text2}</Text>}
      </View>
    </View>
  ),
  delete: ({ text1, text2 }: CustomToastProps) => (
    <View style={[$container, $deleteContainer]}>
      <Icon icon="delete" color={colors.palette.neutral700} size={typography.iconSize} />
      <View style={$textContainer}>
        {text1 && <Text style={[$text, $titleText, $deleteText]}>{text1}</Text>}
        {text2 && <Text style={[$text, $messageText]}>{text2}</Text>}
      </View>
    </View>
  ),
};

export default toastConfig;

const $container: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: "flex-start",
  backgroundColor: colors.elevatedBackground,
  width: '90%',
  height: 'auto',
  minHeight: 56,
  borderLeftWidth: 5,
  padding: spacing.md,
  paddingHorizontal: spacing.md,
  borderRadius: spacing.xxs,
  zIndex: 1000,
  gap: spacing.sm,
}

const $errorContainer: ViewStyle = {
  borderColor: colors.error,
  backgroundColor: colors.errorBackground,
}

const $successContainer: ViewStyle = {
  borderColor: colors.success,
  backgroundColor: colors.successBackground,
}

const $infoContainer: ViewStyle = {
  borderColor: colors.palette.primary500,
  backgroundColor: colors.elevatedBackground,
}

const $deleteContainer: ViewStyle = {
  borderColor: colors.palette.neutral300,
  backgroundColor: colors.elevatedBackground,
}

const $textContainer: ViewStyle = {
  flex: 1,
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  color: colors.text,
}

const $titleText: TextStyle = {
  fontFamily: typography.primary.bold,
  fontSize: 16,
}

const $errorText: TextStyle = {
  color: colors.error,
}

const $successText: TextStyle = {
  color: colors.success,
}

const $infoText: TextStyle = {
  color: colors.palette.primary500,
}

const $deleteText: TextStyle = {
  color: colors.error,
}

const $messageText: TextStyle = {
  fontSize: 14,
}