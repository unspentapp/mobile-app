import React, { FC } from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { Text, Icon } from "app/components"
import { spacing } from "app/theme"
import { MainTabScreenProps } from "app/navigators/MainNavigator"
import { goBack } from "app/navigators"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface AnalyticsScreenProps extends MainTabScreenProps<"Analytics"> {}

export const AnalyticsScreen: FC<AnalyticsScreenProps> = (
  _props,
) => {
  // const { navigation } = _props
  const { top } = useSafeAreaInsets()
  // const logout = useStore((state) => state.logout)

  return (
    <View style={$screenContainer}>
      <View style={[$container, { paddingTop: top }]}>
        <View style={$topContainer}>
          <TouchableOpacity
            style={$goBackButton}
            onPress={goBack}
          >
            <Icon icon={"back"} />
          </TouchableOpacity>
          <Text testID="analytics-heading" tx={"analyticsScreen.title"} preset="heading" />
        </View>

        <View style={$contentWrapper}>
          <Text text="Coming soon" preset="subheading"/>
        </View>
      </View>
    </View>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
}

const $topContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
  justifyContent: "flex-start",
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.sm,
}

const $goBackButton: ViewStyle = {
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xs,
}

const $contentWrapper: ViewStyle = {
  flex: 1,
  alignItems: "center",
}



