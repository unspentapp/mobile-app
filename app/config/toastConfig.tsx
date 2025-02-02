import React from 'react';
import { View, Text, ViewStyle, TextStyle } from "react-native"
import { BaseToastProps } from 'react-native-toast-message';
import { colors, spacing, typography } from "app/theme"

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const toastConfig = {
  error: ({ text1, text2 }: CustomToastProps) => (
    <View style={$container}>
      {text1 && (
        <Text style={$text}>
          {text1}
          </Text>
      )}
      {text2 && <Text style={{ color: 'white' }}>{text2}</Text>}
    </View>
  ),
  success: ({ text1, text2 }: CustomToastProps) => (
    <View style={$container}>
      {text1 && (
        <Text style={$text}>
          {text1}
          </Text>
      )}
      {text2 && <Text style={{ color: 'white' }}>{text2}</Text>}
    </View>
  ),
  delete: ({ text1, text2 }: CustomToastProps) => (
    <View style={$container}>
      {text1 && (
        <Text style={$text}>
          {text1}
          </Text>
      )}
    {text2 && <Text style={{ color: 'white' }}>{text2}</Text>}
    </View>
  ),
};

export default toastConfig;

const $container: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: "flex-start",
  width: '90%',
  height: 52,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  backgroundColor: colors.palette.neutral300,
  padding: spacing.md,
  borderRadius: spacing.md,
}
const $text: TextStyle = {
  fontFamily: typography.primary.medium
}