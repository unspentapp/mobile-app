/* eslint-disable react/jsx-key, react-native/no-inline-styles */
import React from "react"
import { ListItem, Text } from "app/components"
import { TextStyle, ViewStyle } from "react-native"

export interface Expense {
  name: string
  description?: string
  value: number
}

export const ExpenseCard = (props: Expense) => {
  return (
    // <ListItem
    //   bottomSeparator={true}
    //   text={props.name}
    //   RightComponent={
    //     <Text text={props.value.toString()} />
    //   }
    // />
    <ListItem
      LeftComponent={<Text>{props.name}</Text>}
      RightComponent={<Text style={$textValue}>{props.value} €</Text>}
      bottomSeparator={true}
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