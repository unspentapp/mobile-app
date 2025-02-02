import React from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "app/components/Text"
import { colors, spacing, typography } from "app/theme"
import format from "date-fns/format"
import { TransactionDataI } from "../../db/useWmStorage"

export interface RowItemProps {
  data : TransactionDataI
}

const RowItem = ({ data } : RowItemProps) => {

  const isExpense = () => {
    return data.type === "expense"
  }

  return (
    <View>
      <TouchableOpacity style={$container}>
        <View style={$leftContainer}>
          <Text style={$description} numberOfLines={1}>
            {data.description}
          </Text>

          {/* todo dynamic currency */}
          <Text style={$date}>
            {format(data.transactionAt, "dd MMM", { weekStartsOn: 0 })}
          </Text>
        </View>
        {/*
         * expense >> - sign [red]
         * income >> + sign [green]
         */}
        <Text style={[$amount, isExpense() ? $expense : $income]}>
          {data.type === "expense" ? "- " : "+ "}
          <Text style={$amount}>{data.amount} €</Text>
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default RowItem

const $container: ViewStyle = {
  position: "relative",
  width: '100%',
  height: 56,
  paddingHorizontal: spacing.sm,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}

const $leftContainer: ViewStyle = {
  flex: 1,
  paddingVertical: spacing.md,
}

const $description: TextStyle = {
  textTransform: "capitalize",
  fontSize: 16,
  marginRight: spacing.md,
}

const $date: TextStyle = {
  color: colors.textDim,
  fontSize: 12
}

const $amount: TextStyle = {
  fontFamily: typography.primary.bold,
  color: colors.text
}

const $expense: TextStyle = {
  color: colors.palette.angry500,
}

const $income: TextStyle = {
  color: colors.palette.secondary400
}