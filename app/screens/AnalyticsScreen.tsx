import React, { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Text, Screen } from "app/components"
import { colors, spacing } from "app/theme"
import { useHeader } from "app/utils/useHeader"
import { useStore } from "app/store"
import { MainTabScreenProps } from "app/navigators/MainNavigator"


interface AnalyticsScreenProps extends MainTabScreenProps<"Analytics"> {}

export const AnalyticsScreen: FC<AnalyticsScreenProps> = (
  _props,
) => {
  const { navigation } = _props
  const logout = useStore((state) => state.logout)

  /* COMMON */
  function goSettings() {
    navigation.navigate("Settings")
  }

  useHeader({
      leftIcon: "menu",
      rightIcon: "settings",
      onRightPress: goSettings,
  }, [logout])

  return (

    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <View style={$topContainer}>
        <Text
          testID="analytics-heading"
          tx={"analyticsScreen.title"}
          preset="heading"
        />
      </View>
    </Screen>

  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  justifyContent: "flex-start",
  paddingHorizontal: spacing.lg,
}


