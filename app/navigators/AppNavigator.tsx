/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams, useFocusEffect,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useCallback, useEffect, useRef } from "react"
import { BackHandler, useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
// import { DemoTabParamList } from "./DemoNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
// import { useStore, isAuthenticatedSelector } from "app/store";
import { MainNavigator, MainTabParamList } from "app/navigators/MainNavigator"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "app/services/auth/useAuth"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  Main: NavigatorScreenParams<MainTabParamList>
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const RootStack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  // use a selector to pick only that value
  const { isAuthenticated } = useAuth()

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        statusBarHidden: true,
    }}
      initialRouteName={isAuthenticated ? "Main" : "Login"}
    >
      {isAuthenticated ? (
        <>
          {/*<RootStack.Screen name="Welcome" component={Screens.WelcomeScreen} />*/}
          <RootStack.Screen name="Main" component={MainNavigator} />
        </>
      ) : (
        <>
          <RootStack.Screen name="Login" component={Screens.SignInScreen} />
        </>
      )}

      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </RootStack.Navigator>
  )
}

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={DefaultTheme}
      // theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
}
