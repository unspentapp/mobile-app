import React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Text } from "app/components"
import { colors, spacing, typography } from "app/theme"
import { differenceInCalendarDays, endOfMonth } from "date-fns"

type Props = {
  totalMonthlyExpenses: number
}

const MonthReviewCard = ({ totalMonthlyExpenses }: Props) => {
  const daysRamaining = differenceInCalendarDays(endOfMonth(new Date()), new Date())

  return (
    <View style={$container}>
      <Text tx={"homeScreen.monthReview.title"} style={$title} />
      <Text style={$expenseText} text={`${totalMonthlyExpenses} €`} />
      <Text style={$daysLeftText} text={`${daysRamaining} days left`} />
    </View>
  )
}

export default MonthReviewCard

const $container: ViewStyle = {
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xs,
}

const $title: TextStyle = {
  textTransform: "uppercase",
  fontFamily: typography.secondary?.medium,
  fontSize: 14,
  color: colors.textDim,

}

const $expenseText: TextStyle = {
  fontFamily: typography.primary.bold,
  fontSize: 40,
  lineHeight: 42,
  marginTop: spacing.xs,
}

const $daysLeftText: TextStyle = {
  color: colors.textDim,
}