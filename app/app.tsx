/* eslint-disable import/first */
/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */


import { GestureHandlerRootView } from "react-native-gesture-handler"

if (__DEV__) {
  // Load Reactotron in development only.
  // Note that you must be using metro's `inlineRequires` for this to work.
  // If you turn it off in metro.config.js, you'll have to manually import it.
  require("./devtools/ReactotronConfig.ts")
}
import "./utils/gestureHandler"
import "./i18n"
import "./utils/ignoreWarnings"
import { useFonts } from "expo-font"
import React, { useEffect } from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import * as Linking from "expo-linking"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "app/screens"
import { customFontsToLoad } from "./theme"
import Config from "./config"
import { AuthProvider } from "app/services/auth/useAuth"
import clientAuthStorageInstance from "app/utils/storage/SupabaseClientStorage"
import { useSessionRehydration } from "app/hooks/useSessionRehydration"

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

// Web linking configuration
const prefix = Linking.createURL("/")
// todo
const config = {
  screens: {
    Login: "Login",
    Signup: "Signup",
    // Welcome: "welcome",
    Main: {
      screens: {
        Expenses: "Expenses",
        Analytics: "Analytics",
        AllTransactions: "AllTransactions",
        Settings: "Settings"
      }
    },
    TransactionDetails: "TransactionDetails",
  },
}

interface AppProps {
  hideSplashScreen: () => Promise<void>
}

/**
 * This is the root component of our app.
 * @param {AppProps} props - The props for the `App` component.
 * @returns {JSX.Element} The rendered `App` component.
 */
function App(props: AppProps) {
  const { hideSplashScreen } = props
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(clientAuthStorageInstance , NAVIGATION_PERSISTENCE_KEY)

  const { isRehydrated } = useSessionRehydration()

  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)

  // todo
  // const rehydrated = useStore((state) => state._hasHydrated)
  useEffect(() => {
    if (isRehydrated) {
      hideSplashScreen()
    }
  }, [isRehydrated])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!isNavigationStateRestored || (!areFontsLoaded && !fontLoadError)) { //  todo add hasHydrated or something like that
    return null
  }

  const linking = {
    prefixes: [prefix],
    config,
  }

  // otherwise, we're ready to render the app
  return (
    <AuthProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ErrorBoundary catchErrors={Config.catchErrors}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppNavigator
              linking={linking}
              initialState={initialNavigationState}
              onStateChange={onNavigationStateChange}
            />
          </GestureHandlerRootView>
        </ErrorBoundary>
      </SafeAreaProvider>
    </AuthProvider>
  )
}

export default App
