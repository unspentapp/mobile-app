import React, { RefObject, useMemo } from "react"
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetFooter,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet"
import {
  Platform,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Text } from "app/components"
import BottomSheetBackdrop from "app/components/BottomSheetBackdrop"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BottomSheetDefaultFooterProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types"
import { colors, spacing, typography } from "app/theme"

type ButtonProps = {
  text: string
  onPress?: () => void
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  position?: 'left' | 'right'
  visible?: boolean
}

const defaultPrimaryButton: ButtonProps = {
  text: "Confirm",
  position: "right",
  visible: true,
}

const defaultSecondaryButton: ButtonProps = {
  text: "Cancel",
  position: "left",
  visible: true,
}

type FooterContainerStyle = {
  style?: ViewStyle
  buttonGap?: number
  paddingHorizontal?: number
  paddingVertical?: number
}

export type CustomBottomSheetProps = {
  // Refs
  bottomSheetRef: RefObject<BottomSheetModal>

  // Content
  title?: string
  children?: React.ReactNode

  // Buttons
  primaryButton?: ButtonProps
  secondaryButton?: ButtonProps

  // Footer
  footerContainer?: FooterContainerStyle

  // Customization
  snapPoints?: string[]
  containerStyle?: ViewStyle
  titleStyle?: TextStyle

  // Behavior
  enablePanDownToClose?: boolean
  onDismiss?: () => void
  animateOnMount?: boolean
}


export const ConfirmationSheet = ({
                                    bottomSheetRef,
                                    title,
                                    children,
                                    primaryButton,
                                    secondaryButton,
                                    footerContainer,
                                    snapPoints = ["25%"],
                                    containerStyle,
                                    titleStyle,
                                    enablePanDownToClose = true,
                                    onDismiss,
                                    animateOnMount = true,
                                  }: CustomBottomSheetProps) => {
  const { bottom } = useSafeAreaInsets()

  // Merge default and custom button props
  const mergedPrimaryButton = { ...defaultPrimaryButton, ...primaryButton }
  const mergedSecondaryButton = { ...defaultSecondaryButton, ...secondaryButton }

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  })

  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints])

  const renderFooter = (props: BottomSheetDefaultFooterProps) => (
    <BottomSheetFooter {...props} bottomInset={bottom}>
      <View style={[
        $footerContainer,
        {
          gap: footerContainer?.buttonGap ?? spacing.md,
          paddingHorizontal: footerContainer?.paddingHorizontal ?? spacing.lg,
          paddingVertical: footerContainer?.paddingVertical ?? spacing.md,
        },
        footerContainer?.style
      ]}>
        <TouchableOpacity
          onPress={mergedSecondaryButton.onPress}
          style={[$secondaryButton, mergedSecondaryButton.style]}
          disabled={mergedSecondaryButton.disabled}
        >
          <Text
            text={mergedSecondaryButton.text}
            style={[$secondaryButtonText, mergedSecondaryButton.textStyle]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={mergedPrimaryButton.onPress}
          style={[$primaryButton, mergedPrimaryButton.style]}
          disabled={mergedPrimaryButton.disabled}
        >
          <Text
            text={mergedPrimaryButton.text}
            style={[$primaryButtonText, mergedPrimaryButton.textStyle]}
          />
        </TouchableOpacity>
      </View>
    </BottomSheetFooter>
  )

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      animationConfigs={animationConfigs}
      handleIndicatorStyle={$modalIndicator}
      snapPoints={memoizedSnapPoints}
      enablePanDownToClose={enablePanDownToClose}
      animateOnMount={animateOnMount}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} />}
      onDismiss={onDismiss}
      footerComponent={renderFooter}
      android_keyboardInputMode="adjustResize"
      keyboardBehavior={Platform.OS === "ios" ? "extend" : "interactive"}
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={[$container, containerStyle]}>
        {title && (
          <Text
            text={title}
            preset="subheading"
            style={[$title, titleStyle]}
          />
        )}
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  )
}


// Styles
const $container: ViewStyle = {
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.lg,
  backgroundColor: colors.elevatedBackground,
}

const $title: TextStyle = {
  marginBottom: spacing.md,
}

const $modalIndicator: ViewStyle = {
  backgroundColor: colors.palette.primary500,
}

const $footerContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
}

const $primaryButton: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.primary500,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  borderRadius: spacing.xs,
  alignItems: "center",
  justifyContent: "center",
}

const $secondaryButton: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.neutral200,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  borderRadius: spacing.xs,
  alignItems: "center",
  justifyContent: "center",
}

const $primaryButtonText: TextStyle = {
  fontFamily: typography.primary.medium,
  fontSize: 16,
  color: colors.palette.neutral000,
}

const $secondaryButtonText: TextStyle = {
  fontFamily: typography.primary.medium,
  fontSize: 16,
  color: colors.palette.neutral700,
}