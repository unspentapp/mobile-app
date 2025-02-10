import React, { useCallback, useMemo, useRef, useState } from "react"
import {
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet"
import { Button, Icon, Text } from "app/components"
import { Platform, Pressable, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"
import database from "../db"
import BottomSheetBackdrop from "app/components/BottomSheetBackdrop"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const AddCategoryModal = ({ addCategorySheetRef }) => {
  const [categoryName, setCategoryName] = useState("")
  const [selectedColor, setSelectedColor] = useState<keyof typeof colors.custom>("color1")

  const { bottom } = useSafeAreaInsets()

  const isColorSelected = (color : keyof typeof colors.custom) => {
    return color === selectedColor
  }

  const handleAddCategory = async () => {
    await database.write(async () => {
      const categoriesCollection = database.get('categories')
      await categoriesCollection.create((category) => {
        category.name = categoryName
        category.type = "expense"
        category.isDefault = false
        category.color = selectedColor
      })
    })
    setCategoryName("")
    setSelectedColor("color1")

    addCategorySheetRef.current?.dismiss()
  }

  const resetModal = useCallback(() => {
    setCategoryName("")
    setSelectedColor("color1")
  }, [])

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const snapPoints = useMemo(() => ["50%", "75%"], []);

  const renderFooter = useCallback(
    props => (
      <BottomSheetFooter {...props} bottomInset={bottom}>
        <View>
          <Pressable
            onPress={handleAddCategory}
            style={$closeButton}
          >
            <Icon icon={"check"} color={colors.palette.neutral100} />
          </Pressable>
        </View>
      </BottomSheetFooter>
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={addCategorySheetRef}
      animationConfigs={animationConfigs}
      handleIndicatorStyle={$modalIndicator}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableDynamicSizing={true}
      animateOnMount={true}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} />}
      onDismiss={resetModal}
      footerComponent={renderFooter}
      android_keyboardInputMode="adjustResize"
      keyboardBehavior={Platform.OS === 'ios' ? 'extend' : 'interactive'}
      keyboardBlurBehavior="restore"
    >
        <BottomSheetView style={$addCategorySheetContainer}>
          <Text text="Add new category" preset={"subheading"}/>
          <View style={$modalAddCategoryInputContainer}>
            <Icon icon="tags" color={colors.palette.neutral400} size={typography.iconSize}/>
            <BottomSheetTextInput
              style={$modalAddCategoryInput}
              textAlign="left"
              inputMode="text"
              returnKeyType="done"
              cursorColor={colors.palette.primary500}
              placeholder="Category name"
              placeholderTextColor={colors.palette.neutral400}
              maxFontSizeMultiplier={0}
              maxLength={40}
              onChangeText={setCategoryName}
              onSubmitEditing={handleAddCategory}
            />
          </View>
          <View style={$colorsContainer}>
            {Object.entries(colors.custom).map(([key , value]) => (
              <Pressable
                key={key}
                style={[
                  $colorBorder,
                  isColorSelected(key as keyof typeof colors.custom) ? { borderColor: colors.palette.primary500 } : { borderColor: colors.transparent },
                ]}
                onPress={() => setSelectedColor(key as keyof typeof colors.custom)}
              >
              <View
                style={[$colorCircle,
                  { backgroundColor: value },
                  value === "#ffffff" ? { borderWidth: 1, borderColor: colors.palette.neutral300 } : { borderColor: colors.transparent },
                ]}
              />
              </Pressable>
            ))}
          </View>
        </BottomSheetView>
    </BottomSheetModal>
  )
}

export default AddCategoryModal

const $addCategorySheetContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.lg,
  backgroundColor: colors.palette.neutral000,
}

const $modalAddCategoryInputContainer: ViewStyle = {
  flexDirection: 'row',
  gap: spacing.xs,
  justifyContent: 'flex-start',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  marginTop: spacing.xs,
  marginBottom: spacing.sm,
  borderRadius: spacing.xxs,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  minWidth: "50%",
  maxWidth: "100%"
}

const $modalAddCategoryInput: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 16,
  color: colors.palette.neutral700,
  width: "100%",
}

const $modalIndicator: ViewStyle = {
  backgroundColor: colors.palette.primary500,
}

const $colorsContainer: ViewStyle = {
  marginTop: spacing.md,
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: spacing.lg,
  marginBottom: spacing.lg,
}

const $colorBorder: ViewStyle = {
  padding: 3,
  borderRadius: spacing.xxxl,
  borderWidth: 3,
}

const $colorCircle: ViewStyle = {
  height: spacing.xl,
  width: spacing.xl,
  borderRadius: spacing.lg,
}

const $closeButton: ViewStyle = {
  margin: spacing.lg,
  height: 56,
  width: 56,
  padding: spacing.md,
  borderRadius: 50,
  backgroundColor: colors.palette.primary500,
  alignSelf: "flex-end",
  justifyContent: "center",
}


/*const $footerContainer: ViewStyle = {
  padding: 12,
  margin: 12,
  borderRadius: 12,
  backgroundColor: '#80f',
}*/

