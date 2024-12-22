import React from "react"
import RNDateTimePicker from "@react-native-community/datetimepicker"
import { Text } from "../components/Text"
import { View } from "react-native"

const DateSelectScreen = () => {
  return (
    <View>
      <Text>Select Date</Text>
      <RNDateTimePicker display="default" value={new Date()}/>
    </View>
  )
}

export default DateSelectScreen