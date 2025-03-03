import { ExpoConfig, ConfigContext } from "@expo/config"

/**
 * Use ts-node here so we can use TypeScript for our Config Plugins
 * and not have to compile them to JavaScript
 */
require("ts-node/register")

// const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';
const getUniqueIdentifier = () => {
/*  if (IS_DEV) {
    return 'com.yourname.stickersmash.dev';
  } */

  if (IS_PREVIEW) {
    return 'com.unspentapp.preview';
  }

  return 'com.unspentapp';
};

const getAppName = () => {
  /* if (IS_DEV) {
    return 'Unspent (Dev)';
  } */

  if (IS_PREVIEW) {
    return 'Unspent (Preview)';
  }

  return 'Unspent';
};


/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 * 
 * You can read more about Expo's Configuration Resolution Rules here:
 * https://docs.expo.dev/workflow/configuration/#configuration-resolution-rules
 */
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const existingPlugins = config.plugins ?? []

  return {
    ...config,
    plugins: [
      ...existingPlugins,
      require("./plugins/withSplashScreen").withSplashScreen,
    ],
    name: getAppName(),
    android: {
      package: getUniqueIdentifier(),
    },
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    }
  }
}

