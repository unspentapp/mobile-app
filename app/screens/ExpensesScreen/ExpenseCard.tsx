/* eslint-disable react/jsx-key, react-native/no-inline-styles */
import React from "react"
import { ListItem, Text } from "app/components"
import { GestureResponderEvent, TextStyle, ViewStyle } from "react-native"
import { Expense } from "app/models/Expense"
import { Category } from "app/models/Category"

interface Props {
  expense: Expense;
  category: Category;
  onPress?: (event: GestureResponderEvent) => void
}

export const ExpenseCard = (props: Props) => {
  return (
    <ListItem
      LeftComponent={<Text style={$textValue1}>{props.expense.description}</Text>}
      RightComponent={<Text style={$textValue}>{props.expense.value} €</Text>}
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