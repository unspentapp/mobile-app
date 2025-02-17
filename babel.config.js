/** @type {import('@babel/core').TransformOptions['plugins']} */
const plugins = [
  ["@babel/plugin-proposal-decorators", { "version": "legacy" }],
  ["@babel/plugin-transform-class-properties", { "loose": true }],
  ['@babel/plugin-transform-flow-strip-types'],
  ['@babel/plugin-proposal-class-properties', {loose: true}],
  /** react-native-reanimated web support @see https://docs.swmansion.com/react-native-reanimated/docs/guides/web-support/ */
  "@babel/plugin-transform-export-namespace-from",
  "react-native-reanimated/plugin",
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