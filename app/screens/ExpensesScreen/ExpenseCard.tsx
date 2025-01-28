import React from "react"
import { ListItem, Text } from "app/components"
import { GestureResponderEvent, TextStyle, ViewStyle } from "react-native"
import { log } from "app/utils/logger"
import CategoryModel from "../../../db/models/CategoryModel"
import TransactionModel from "../../../db/models/TransactionModel"

interface Props {
  expense: TransactionModel;
  category: CategoryModel
  onPress?: (event: GestureResponderEvent) => void
}

export const ExpenseCard = (props: Props) => {
  log.info(props.expense.amount, props.expense.description)

  return (
    <ListItem
      LeftComponent={<Text style={$textValue1}>{props.expense.description}</Text>}
      RightComponent={<Text style={$textValue}>{props.expense.amount} €</Text>}
      bottomSeparator={true}
      onLongPress={props.onPress}
      style={$itemList}
    />
  )
}

const $itemList : ViewStyle = {

  alignItems: "center"

}

const $textValue : TextStyle = {
  fontWeight: "bold",
}

const $textValue1 : TextStyle = {
  overflow: "hidden",
}