import React from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "app/components/Text"
import { spacing, typography } from "app/theme"
import { TransactionDataI } from "../../db/useWmStorage"



const RowItem = ({ data }) => {
  return (
    <View>
      <TouchableOpacity style={$container}>
        <Text style={$description}>{data.description} </Text>

        {/* todo dynamic currency */}
        <Text style={$amount}>
          {data.date}
          {data.type === "expense" ? `-${data.amount}` : `+${data.amount}`} €
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default RowItem

const $container: ViewStyle = {
  width: '100%',
  height: spacing.xxl,
  paddingHorizontal: spacing.sm,
  flexDirection: 'row',
  justifyContent: 'space-between',
}

const $description: TextStyle = {

}

const $amount: TextStyle = {
  fontFamily: typography.primary.bold,
}