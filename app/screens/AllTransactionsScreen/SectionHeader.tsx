import React from 'react'
import { View, ViewStyle, TextStyle } from 'react-native'
import { Text } from 'app/components/Text'
import { colors, spacing, typography } from 'app/theme'

interface SectionHeaderProps {
  section: {
    month: string
    title: string
    isFirstWeekOfMonth: boolean
    monthlyStats: {
      totalIncome: number
      totalExpenses: number
    }
    weeklyStats: {
      totalIncome: number
      totalExpenses: number
    }
  }
}

export const SectionHeader = ({ section }: SectionHeaderProps) => {
  const monthlyBalance = section.monthlyStats.totalIncome - section.monthlyStats.totalExpenses
  const weeklyBalance = section.weeklyStats.totalIncome - section.weeklyStats.totalExpenses

  return (
    <View>
      {section.isFirstWeekOfMonth && (
        <View style={$monthHeaderContainer}>
          <Text style={$monthHeaderText}>{section.month}</Text>
          <Text style={[$monthStatValue, monthlyBalance >= 0 ? $income : $expense]}>
            {monthlyBalance >= 0 ? '+ ' : '- '}{Math.abs(monthlyBalance)} €
          </Text>
        </View>
      )}
      <View style={$sectionHeader}>
        <Text style={$sectionHeaderText}>{section.title}</Text>
        <Text style={$statValue}>
          {weeklyBalance >= 0 ? '+ ' : '- '}{Math.abs(weeklyBalance)} €
        </Text>
      </View>
    </View>
  )
}

const $monthHeaderContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.md,
}

const $monthHeaderText: TextStyle = {
  fontFamily: typography.primary.bold,
  fontSize: 20,
  color: colors.text,
};

const $sectionHeader: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: spacing.sm,
  marginBottom: spacing.xxs,
  paddingHorizontal: spacing.md,
  backgroundColor: colors.background,
};

const $sectionHeaderText: TextStyle = {
  fontFamily: typography.primary.medium,
  fontSize: 14,
  color: colors.textDim,
};

const $monthStatValue: TextStyle = {
  fontFamily: typography.primary.bold,
  fontSize: 20,
}

const $statValue: TextStyle = {
  fontFamily: typography.primary.medium,
  color: colors.textDim,
  fontSize: 14,
};

const $expense: TextStyle = {
  color: colors.palette.angry500,
}

const $income: TextStyle = {
  color: colors.palette.secondary400
}
