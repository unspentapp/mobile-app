import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "../i18n"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { SettingsScreen } from "app/screens/SettingsScreen"
import { ExpensesNavigator } from "app/navigators/ExpensesNavigator"
import { AnalyticsScreen } from "app/screens"

export type MainTabParamList = {
  Analytics: undefined,
  Settings: undefined
  ExpensesNavigator: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<MainTabParamList>()

/**
 * This is the main navigator for the screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `MainNavigator`.
 */
export function MainNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 55 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >

      <Tab.Screen
        name="ExpensesNavigator"
        component={ExpensesNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: translate("mainNavigator.expensesTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="home" color={focused ? colors.tint : undefined} size={25} />
          ),
        }}
      />


      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: translate("mainNavigator.analyticsTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="chart" color={focused ? colors.tint : undefined} size={25} />
          ),
        }}
      />


      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: translate("mainNavigator.settingsTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="settings" color={focused ? colors.tint : undefined} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.sm,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
