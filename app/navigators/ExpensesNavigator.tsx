import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { HomeScreen } from "app/screens/ExpensesScreen/HomeScreen"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { colors } from "app/theme"
import { StatusBar } from "expo-status-bar"
import { AllTransactionsScreen } from "app/screens/AllTransactionsScreen"
import { translate } from "app/i18n"
import { Icon } from "app/components"

export type ExpensesStackParamList = {
  Expenses: undefined,
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type ExpensesStackScreenProps<T extends keyof ExpensesStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ExpensesStackParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const ExpensesStack = createNativeStackNavigator<ExpensesStackScreenProps<"Expenses">>()

/**
 * This is the main navigator with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */
export function ExpensesNavigator() {

  return (
    <ExpensesStack.Navigator>
      <ExpensesStack.Screen
        name="Expenses"
        component={HomeScreen}
        options={{
          headerShown: false,
          statusBarColor: colors.background,
          statusBarStyle: "dark",
          statusBarHidden: false,
        }}
      />

    </ExpensesStack.Navigator>
  )
}

