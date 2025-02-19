import React from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "app/components/Text"
import { colors, spacing, typography } from "app/theme"
import format from "date-fns/format"
import { TransactionDataI } from "../../db/useWmStorage"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { AppStackParamList } from "app/navigators"
import { withObservables } from "@nozbe/watermelondb/react"
import TransactionModel from "../../db/models/TransactionModel"

export interface RowItemProps {
  transaction : TransactionDataI
}

const RowItem = ({ transaction } : RowItemProps) => {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>()


  const isExpense = () => {
    return transaction.type === "expense"
  }

  return (
    <View>
      <TouchableOpacity
        style={$container}
        onPress={() => navigation.navigate("TransactionDetails", { itemId: transaction.id })} // create a stack navigator and pass the item. In the new screen user should be able to edit transactions
      >
        <View style={$leftContainer}>
          <Text style={$description} numberOfLines={1}>
            {transaction.description}
          </Text>

          {/* todo dynamic currency */}
          <Text style={$date}>
            {format(transaction.transactionAt, "dd MMM", { weekStartsOn: 0 })}
          </Text>
        </View>
        {/*
         * expense >> - sign [red]
         * income >> + sign [green]
         */}
        <Text style={[$amount, isExpense() ? $expense : $income]}>
          {transaction.type === "expense" ? "- " : "+ "}
          <Text style={$amount}>{transaction.amount} €</Text>
        </Text>
      </TouchableOpacity>
    </View>
  )
}


const enhance = withObservables(["transaction"], ({ transaction }: { transaction : TransactionModel }) => ({
  transaction: transaction.observe(),
  category: transaction.category?.observe(),
}))

export default enhance(RowItem)

const $container: ViewStyle = {
  position: "relative",
  width: '100%',
  height: 56,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: spacing.md,
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