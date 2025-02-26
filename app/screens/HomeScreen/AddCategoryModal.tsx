import React, { ForwardedRef, RefObject, useCallback, useEffect, useMemo, useState, memo } from "react"
import {
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet"
import { Icon, Text } from "app/components"
import {
  NativeSyntheticEvent,
  Platform,
  Pressable, TextInput, TextInputSubmitEditingEventData,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { colors, spacing, typography } from "app/theme"
import database from "../../../db"
import BottomSheetBackdrop from "app/components/BottomSheetBackdrop"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import CategoryModel from "../../../db/models/CategoryModel"
import { BottomSheetDefaultFooterProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types"

export type CategoryModalProps = {
  modalType: 'new' | 'edit',
  category: Partial<CategoryModel> | null,
  addCategorySheetRef: RefObject<BottomSheetModal>,
  addCategoryInputRef: RefObject<TextInput>,
  onDismiss?: () => void
  onSubmit?: () => void
}

type CustomTextInputProps = {
  addCategoryInputRef: ForwardedRef<TextInput>,
  value: string,
  onChangeText: (text: string) => void,
  handleAddCategory: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void,
}

/* Memoize the input component to prevent unnecessary re-renders */
const CustomTextInput = memo(({
                                addCategoryInputRef,
                                value,
                                onChangeText,
                                handleAddCategory,
                              }: CustomTextInputProps) => {
  return (
    <BottomSheetTextInput
      ref={addCategoryInputRef}
      defaultValue={value}
      autoComplete={"off"}
      style={$modalAddCategoryInput}
      textAlign="left"
      inputMode="text"
      returnKeyType="done"
      cursorColor={colors.palette.primary500}
      placeholder="Category name"
      placeholderTextColor={colors.palette.neutral400}
      maxFontSizeMultiplier={0}
      maxLength={40}
      onChangeText={onChangeText}
      onSubmitEditing={handleAddCategory}
    />
  )
})

const AddCategoryModal = ({ category, addCategorySheetRef, addCategoryInputRef, modalType, onDismiss } : CategoryModalProps) => {
  const [categoryLabel, setCategoryLabel] = useState<string>(category?.name || "")
  const [selectedColor, setSelectedColor] = useState<keyof typeof colors.custom>(category?.color || "color1")

  useEffect(() => {
    if (category) {
      setCategoryLabel(category.name || "")
      setSelectedColor(category.color || "color1")
    }
  }, [category])

  const { bottom } = useSafeAreaInsets()

  const isColorSelected = useCallback((color : keyof typeof colors.custom) => {
    return color === selectedColor
  }, [selectedColor])

  const handleAddCategory = useCallback(async () => {
    if (categoryLabel.trim() === "") {
      console.log("[ADD CATEGORY]: categoryLabel is empty")
      return
    }

    try {
      await database.write(async () => {
        const categoriesCollection = database.get<CategoryModel>('categories')

        if (category?.id) {
          // Update existing category
          const existingCategory = await categoriesCollection.find(category.id)
          await existingCategory.update(category => {
            category.name = categoryLabel
            category.color = selectedColor
          })
        } else {
          // Create new category
          await categoriesCollection.create((category) => {
            category.name = categoryLabel
            category.type = "expense"
            category.isDefault = false
            category.color = selectedColor
          })
        }
      })
    } finally {
      resetModal()
      addCategorySheetRef.current?.close()
    }
  }, [categoryLabel, selectedColor, category, addCategorySheetRef])

  const handleTextChange = useCallback((text: string) => {
    setCategoryLabel(text)
  }, [])

  const handleSubmitEditing = useCallback(() => {
    handleAddCategory()
  }, [handleAddCategory])

  const resetModal = useCallback(() => {
    setCategoryLabel("")
    setSelectedColor("color1")
    onDismiss?.()
  }, [onDismiss])

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const snapPoints = useMemo(() => ["70%", "85%", "95%"], []);

  const renderFooter = useCallback((props : BottomSheetDefaultFooterProps) => (
    <BottomSheetFooter {...props} bottomInset={bottom}>
      <View>
        <TouchableOpacity
          onPress={handleAddCategory}
          style={$closeButton}
        >
          <Icon icon={"check"} color={colors.palette.neutral100} />
        </TouchableOpacity>
      </View>
    </BottomSheetFooter>
  ), [bottom, handleAddCategory]);

  return (
    <BottomSheetModal
      ref={addCategorySheetRef}
      animationConfigs={animationConfigs}
      handleIndicatorStyle={$modalIndicator}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      animateOnMount={true}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} />}
      onDismiss={resetModal}
      footerComponent={renderFooter}
      android_keyboardInputMode="adjustResize"
      keyboardBehavior={Platform.OS === "ios" ? "extend" : "interactive"}
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={$addCategorySheetContainer}>
        <Text
          text={modalType === 'edit' ? "Edit category" : "Add new category"}
          preset={"subheading"}
        />
        <View style={$modalAddCategoryInputContainer}>
          <Icon icon="tags" color={colors.palette.neutral400} size={typography.iconSize} />

          <CustomTextInput
            addCategoryInputRef={addCategoryInputRef}
            value={categoryLabel}
            onChangeText={handleTextChange}
            handleAddCategory={handleSubmitEditing}
          />
        </View>
        <View style={$colorsContainer}>
          {Object.entries(colors.custom).map(([key, value]) => (
            <Pressable
              key={key}
              style={[
                $colorBorder,
                isColorSelected(key as keyof typeof colors.custom)
                  ? { borderColor: colors.palette.primary500 }
                  : { borderColor: colors.transparent },
              ]}
              onPress={() => setSelectedColor(key as keyof typeof colors.custom)}
            >
              <View
                style={[
                  $colorCircle,
                  { backgroundColor: value },
                  value === "#ffffff"
                    ? $selected
                    : $unselected,
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
  width: "90%",
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

const $selected: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
}

const $unselected: ViewStyle = {
  borderColor: colors.transparent,
}