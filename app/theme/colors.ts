// TODO: write documentation for colors and palette in own markdown file and add links from here
const custom = {
  color1: "#efefef", // Gray
  color2: "#FF1493", // Deep Pink (Pink Family)
  color3: "#DC143C", // Crimson (Red Family)
  color4: "#FF4500", // Vivid Orange-Red (Orange Family)
  color5: "#FF8C00", // Dark Orange (Orange Family)
  color6: "#32CD32", // Lime Green (Green Family)
  color7: "#2E8B57", // Sea Green (Green Family)
  color8: "#4682B4", // Steel Blue (Blue Family)
  color9: "#4169E1", // Royal Blue (Blue Family)
  color10: "#242470", // Midnight Blue (Blue Family)
} as const

const palette = {
  neutral000: "#ffffff",
  neutral100: "#f3f3f3", // this
  neutral200: "#dedede",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#968c83",
  neutral600: "#7a706a",
  neutral700: "#3C3836",
  neutral800: "#302929", // this
  neutral900: "#000000",

  primary100: "#fef2c7",
  primary200: "#fde48a",
  primary300: "#fccf47",
  primary400: "#fbbc24",
  primary500: "#f59b0b", // this
  primary600: "#d97406",

  secondary100: "#00cdb1", // this
  secondary200: "#00a592",
  secondary300: "#028174",
  secondary400: "#07685f",
  secondary500: "#0c554e",

  tertiary100: "#F953B2", // this

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  angry100: "#f2dcd5",
  angry500: "#C03403",

  green100: "#d9ffe4",
  green500: "#186437",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  /**
  * Colors for user personalization
  */
  custom,
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral700,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral100,
  /**
   * The default color of the screen background.
   */
  elevatedBackground: palette.neutral000,
  /**
   * The default border color.
   */
  border: palette.neutral200,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   */
  errorBackground: palette.angry100,
  /**
   * Success messages.
   */
  success: palette.green500,
  /**
   * Success Background.
   */
  successBackground: palette.green100,

}

export type CustomColorType = keyof typeof colors.custom
export type PaletteColorType = keyof typeof colors.palette
export type DefaultColorType = keyof typeof colors
