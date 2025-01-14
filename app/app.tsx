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
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { useStore } from "./store"
import { ErrorBoundary } from "app/screens"
import * as storage from "./utils/storage"
import { customFontsToLoad } from "./theme"
import Config from "./config"
import Toast from "react-native-toast-message"

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

// Web linking configuration
const prefix = Linking.createURL("/")
// todo
const config = {
  screens: {
    Login: {
      path: "",
    },
    Welcome: "welcome",
    Main: {
      screens: {
        DemoShowroom: {
          path: "showroom/:queryIndex?/:itemIndex?",
        },
        Expenses: {
          screens: {
              Expenses: "expenses",
          }
        }
      }
    }
  },
}

interface AppProps {
  hideSplashScreen: () => Promise<boolean>
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
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)

  const rehydrated = useStore((state) => state._hasHydrated)
  useEffect(() => {
    if (rehydrated) {
      setTimeout(hideSplashScreen, 500)
    }
  }, [rehydrated])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!rehydrated || !isNavigationStateRestored || (!areFontsLoaded && !fontLoadError)) {
    return null
  }

  const linking = {
    prefixes: [prefix],
    config,
  }

  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <AppNavigator
              linking={linking}
              initialState={initialNavigationState}
              onStateChange={onNavigationStateChange}
            />
            <Toast/>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

export default App
