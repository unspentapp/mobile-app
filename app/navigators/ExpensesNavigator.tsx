import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { ExpensesScreen } from "app/screens/ExpensesScreen/ExpensesScreen"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { colors } from "app/theme"

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

const ExpensesStack = createNativeStackNavigator<ExpensesStackScreenProps<ExpensesStackParamList>>()

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
          component={ExpensesScreen}
          options={{
            statusBarColor: colors.background,
            statusBarStyle: "dark",
          }}
        />




    </ExpensesStack.Navigator>
  )
}

