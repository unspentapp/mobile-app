import React from "react"
import { Text, View } from "react-native"

const TransactionDetails = ({ itemId }) => {
  const id = 1
  return (
    <View>
      <Text>Transaction details: {itemId}</Text>
    </View>
  )
}

export default TransactionDetails