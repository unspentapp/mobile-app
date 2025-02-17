import React from "react"
import { ListItem, Text } from "app/components"
import { GestureResponderEvent, TextStyle, ViewStyle } from "react-native"
import { log } from "app/utils/logger"
import TransactionModel from "../../../db/models/TransactionModel"

interface Props {
  transaction: TransactionModel;
  // category: CategoryDataI
  onPress?: (event: GestureResponderEvent) => void
}

@deprecated
export const ExpenseCard = (props: Props) => {
  log.info(props.transaction.amount, props.transaction.description)

  return (
    <ListItem
      LeftComponent={<Text style={$textValue1}>{props.transaction.description}</Text>}
      RightComponent={<Text style={$textValue}>{props.transaction.amount} €</Text>}
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