/** @type {import('@babel/core').TransformOptions['plugins']} */
const plugins = [
  /** react-native-reanimated web support @see https://docs.swmansion.com/react-native-reanimated/docs/guides/web-support/ */
  "@babel/plugin-transform-export-namespace-from",
  "react-native-reanimated/plugin",
  ["@babel/plugin-proposal-decorators", { "legacy": true }]

]

/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      "babel-preset-expo",
      // "module:metro-react-native-babel-preset"
    ],
    plugins
  }
}