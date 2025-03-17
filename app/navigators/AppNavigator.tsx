/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DefaultTheme,
  NavigationContainer, NavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useEffect, useState } from "react"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { MainNavigator, MainTabParamList } from "app/navigators/MainNavigator"
import { useAuth } from "app/services/auth/useAuth"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import TransactionDetails from "app/screens/Transactions/TransactionDetails"
import { StatusBar } from "expo-status-bar"
import Toast from "react-native-toast-message"
import ToastConfig from "app/config/toastConfig"
import database from "../../db"
import { AppStackParamList, AuthStackParamList } from "../../types/appStackTypes"

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
const AuthStack = createNativeStackNavigator<AuthStackParamList>()

const AuthNavigator = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null)

  useEffect(() => {
    const checkFirstAccess = async () => {
      const isAlreadyLaunched = await database.localStorage.get("ALREADY_LAUNCHED")
      console.log("already launched? " + isAlreadyLaunched)

      if (!isAlreadyLaunched) {
        setIsFirstLaunch(true)
      } else {
        setIsFirstLaunch(false)
      }
    }

    checkFirstAccess()
  }, [])

  console.log("Current isFirstLaunch state:", isFirstLaunch, typeof(isFirstLaunch))

  return (
    <AuthStack.Navigator
      key={isFirstLaunch ? 'first-launch' : 'returning-user'}
      screenOptions={{ headerShown: false }}
      initialRouteName={isFirstLaunch ? "Onboarding" : "Login"}
    >
      <AuthStack.Screen name={"Onboarding"} component={Screens.OnboardingScreen} />
      <AuthStack.Screen name="Signup" component={Screens.SignUpScreen} />
      <AuthStack.Screen name="Login" component={Screens.SignInScreen} />
    </AuthStack.Navigator>
  )
}

const AppStack = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        animation: "fade",
      }}
    >
      <RootStack.Screen name="Main" component={MainNavigator} />
      <RootStack.Screen
        name="TransactionDetails"
        component={TransactionDetails}
        options={{
          presentation: "card",
        }}
      />
    </RootStack.Navigator>
  )
}

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  const { isAuthenticated } = useAuth()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  console.log("Authenticated? " + isAuthenticated)
/*
  if (isLoading) {
    return <Screens.LoadingScreen />
  }
*/

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        theme={DefaultTheme}
        {...props}
      >
        <BottomSheetModalProvider>
          {isAuthenticated ? <AppStack /> : <AuthNavigator />}
        </BottomSheetModalProvider>
        <StatusBar backgroundColor="transparent" translucent={true} style={"auto"} />
      </NavigationContainer>
      <Toast
        position={"top"}
        config={ToastConfig}
        autoHide={true}
        visibilityTime={3000}
        topOffset={50}
        bottomOffset={90}
      />
    </>
  )
}