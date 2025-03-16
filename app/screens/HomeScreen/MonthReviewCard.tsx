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
  paddingHorizontal: spacing.md,
  paddingTop: spacing.xl,
  paddingBottom: spacing.lg,
  // borderRadius: spacing.xs,
  // backgroundColor: colors.elevatedBackground,
  // marginTop: spacing.xs,
  // marginBottom: spacing.md,
}

const $title: TextStyle = {
  textTransform: "uppercase",
  fontFamily: typography.secondary?.medium,
  fontSize: 13,
  color: colors.text,

}

const $expenseText: TextStyle = {
  fontFamily: typography.primary.bold,
  fontSize: 48,
  lineHeight: 50,
  marginTop: spacing.xs,
}

const $daysLeftText: TextStyle = {
  color: colors.text,
  fontFamily: typography.primary.normal,
  // marginTop: spacing.xxs,
}