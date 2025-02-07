/*
import React, { forwardRef } from "react"
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet"
import { Text } from "app/components/Text"
import { View } from "react-native"
import { colors } from "app/theme"
import { Button } from "app/components/Button"



const BottomSheetModal = () => {
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
      handleIndicatorStyle={$modalIndicator}
    >
      <BottomSheetView style={$contentContainer}>
        <Text>Add new expense</Text>
        <View style={$inputContainer}>
          <BottomSheetTextInput
            style={$modalInput}
            keyboardType="numeric"
            autoComplete="off"
            autoCorrect={false}
            autoFocus={true}
            cursorColor={colors.palette.primary500}
          />

          <Text
            style={$euroSymbol}
            numberOfLines={1}
          >€</Text>

        </View>
        <Button onPress={handleCloseModalPress}>Close</Button>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

export default BottomSheetModal*/
