import React from "react"
import { View, Text, ViewStyle, TextStyle } from "react-native"
import { colors, spacing } from "app/theme"

type StatsCardProps = {
  numerator: number
  denominator: number
}

export const ProgressBar = (props: StatsCardProps) => {
  const { numerator, denominator } = props
  const showProgressBar = denominator !== undefined
  const [containerWidth, setContainerWidth] = React.useState(0)

  // Calculate progress and percentage
  const progress = showProgressBar ? numerator / denominator : 0
  const percentage = Math.round(progress * 100)

  // Calculate progress width only if we have valid container width
  const progressWidth = (containerWidth > 0 && showProgressBar)
    ? containerWidth * progress
    : 0

  return (
    <View
      style={$container}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <View style={$progressBarContainer}>
        <View
          style={[
            $progressBar,
            { width: progressWidth }
          ]}
        />
      </View>
      <View style={$content}>
        <Text style={$percentageText}>{numerator} € / {percentage}%</Text>
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  marginTop: spacing.sm,
  borderRadius: spacing.md,
  width: '100%',
}

const $content: ViewStyle = {
  padding: 8,
  flexDirection: 'row',
  gap: spacing.xxs,
  // justifyContent: 'space-between',
  alignItems: 'center',
}

const $progressBarContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral200,
  height: 6,
  borderRadius: 2,
  width: '100%',
}

const $progressBar: ViewStyle = {
  height: 6,
  width: 0,
  backgroundColor: colors.palette.primary500,
  borderRadius: 2,
}

const $percentageText: TextStyle = {
  fontSize: 14,
  color: colors.textDim,
}