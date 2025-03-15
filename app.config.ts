import { ExpoConfig, ConfigContext } from "@expo/config";

/**
 * Use ts-node here so we can use TypeScript for our Config Plugins
 * and not have to compile them to JavaScript
 */
require("ts-node/register");

// const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_PREVIEW) {
    return 'com.unspentapp.preview';
  }
  return 'com.unspentapp';
};

const getAppName = () => {
  if (IS_PREVIEW) {
    return 'Unspent (Preview)';
  }
  return 'Unspent';
};

interface CustomExpoConfig extends ExpoConfig {
  ignite?: {
    version: string;
  };
}

/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 */
module.exports = ({ config }: ConfigContext): CustomExpoConfig => {
  return {
    name: getAppName(),
    description: "The app which helps you to save money.",
    slug: "unspent_app",
    scheme: "com.unspentapp",
    version: "0.0.1",
    orientation: "portrait",
    icon: "./assets/images/app-icon-all.png",
    splash: {
      image: "./assets/images/splash-logo-all.png",
      resizeMode: "cover",
      backgroundColor: "#fff"
    },
    userInterfaceStyle: "automatic",
    updates: {
      fallbackToCacheTimeout: 0
    },
    jsEngine: "hermes",
    assetBundlePatterns: [
      "**/*"
    ],
    android: {
      package: getUniqueIdentifier(),
      icon: "./assets/images/app-icon-android-legacy.png",
      adaptiveIcon: {
        foregroundImage: "./assets/images/app-icon-android-adaptive-foreground.png",
        backgroundImage: "./assets/images/app-icon-android-adaptive-background.png"
      },
      splash: {
        image: "./assets/images/splash-logo-all.png",
        resizeMode: "cover"
      }
    },
    androidStatusBar: {
      translucent: true,
    },
    ios: {
      icon: "./assets/images/app-icon-ios.png",
      supportsTablet: true,
      bundleIdentifier: getUniqueIdentifier(),
      splash: {
        image: "./assets/images/splash-logo-ios-mobile.png",
        tabletImage: "./assets/images/splash-logo-ios-tablet.png",
        resizeMode: "cover"
      }
    },
    web: {
      favicon: "./assets/images/app-icon-web-favicon.png",
      splash: {
        image: "./assets/images/splash-logo-web.png",
        resizeMode: "contain"
      },
      bundler: "metro"
    },
    plugins: [
      "expo-localization",
      "expo-secure-store",
      [
        "expo-build-properties",
        {
          "newArchEnabled": true,
          "ios": {
            "extraPods": [
              {
                "name": "simdjson",
                "configurations": [
                  "Debug",
                  "Release"
                ],
                "path": "../node_modules/@nozbe/simdjson",
                "modular_headers": true
              }
            ]
          },
          "android": {
            "usesCleartextTraffic": true
          }
        }
      ],
      "expo-font",
      require("./plugins/withSplashScreen").withSplashScreen,
    ],
    experiments: {
      tsconfigPaths: true
    },
    extra: {
      eas: {
        projectId: "ba64347d-78b1-42d0-835f-ce456d9c7fdd"
      },
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
    ignite: {
      version: "9.10.1"
    }
  };
};