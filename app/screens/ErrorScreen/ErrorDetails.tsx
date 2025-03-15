import React, { ErrorInfo } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Button, Icon, Text } from "app/components"
import { colors, spacing } from "app/theme"
import { StatusBar } from "expo-status-bar"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export interface ErrorDetailsProps {
  error: Error
  errorInfo: ErrorInfo | null
  onReset(): void
}

/**
 * Renders the error details screen.
 * @param {ErrorDetailsProps} props - The props for the `ErrorDetails` component.
 * @returns {JSX.Element} The rendered `ErrorDetails` component.
 */
export function ErrorDetails(props: ErrorDetailsProps) {
  const { top } = useSafeAreaInsets()

  return (
    <View style={$screenContainer}>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <View style={[$container, { paddingTop: top }]}>

      <View style={$topSection}>
        <Icon icon="ladybug" size={64} />
        <Text style={$heading} preset="subheading" tx="errorScreen.title" />
        <Text tx="errorScreen.friendlySubtitle" />
      </View>

      <ScrollView style={$errorSection} contentContainerStyle={$errorSectionContentContainer}>
        <Text style={$errorContent} weight="bold" text={`${props.error}`.trim()} />
        <Text
          selectable
          style={$errorBacktrace}
          text={`${props.errorInfo?.componentStack ?? ""}`.trim()}
        />
      </ScrollView>

      <Button
        preset="reversed"
        style={$resetButton}
        onPress={props.onReset}
        tx="errorScreen.reset"
      />
      </View>
    </View>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $container: ViewStyle = {
  flex: 1,
  marginVertical: spacing.lg,
  paddingHorizontal: spacing.lg,
}

const $topSection: ViewStyle = {
  flex: 1,
  alignItems: "center",
}

const $heading: TextStyle = {
  color: colors.error,
  marginBottom: spacing.md,
}

const $errorSection: ViewStyle = {
  flex: 2,
  backgroundColor: colors.separator,
  marginVertical: spacing.md,
  borderRadius: 6,
}

const $errorSectionContentContainer: ViewStyle = {
  padding: spacing.md,
}

const $errorContent: TextStyle = {
  color: colors.error,
}

const $errorBacktrace: TextStyle = {
  marginTop: spacing.md,
  color: colors.textDim,
}

const $resetButton: ViewStyle = {
  backgroundColor: colors.error,
  paddingHorizontal: spacing.xxl,
}
