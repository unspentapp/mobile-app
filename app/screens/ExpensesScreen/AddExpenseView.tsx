import React, { Dispatch, RefObject, SetStateAction, useRef } from "react"
import { Button, Icon, Text } from "app/components"
import { Pressable, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet"
import { colors, spacing, typography } from "app/theme"
import { isToday } from "date-fns"
import format from "date-fns/format"
import { Tag } from "app/components/Tag"
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { getCategories } from "assets/data"

export type AddExpenseProps = {
  bottomSheetModalRef: RefObject<BottomSheetModalMethods>,
  handleSheetChanges: (index: number) => void,
  expenseValue: string,
  setExpenseValue: Dispatch<SetStateAction<string>>,
  setNote: Dispatch<SetStateAction<string>>,
  date: string,
  setDate: Dispatch<SetStateAction<string>>,
  setDateModalToggle: Dispatch<SetStateAction<boolean>>,
  selectedCategory: string,
  setSelectedCategory: Dispatch<SetStateAction<string>>,
  handleAddExpense: () => void,
}

type BottomSheetTextInputRef = TextInput;

const AddExpenseView = ({
                          bottomSheetModalRef,
                          handleSheetChanges,
                          expenseValue,
                          setExpenseValue,
                          setNote,
                          date,
                          setDate,
                          setDateModalToggle,
                          selectedCategory,
                          setSelectedCategory,
                          handleAddExpense
                        }: AddExpenseProps) => {
  const categories = getCategories()

  const firstTextInputRef = useRef<BottomSheetTextInputRef>(null);
  const secondTextInputRef = useRef<BottomSheetTextInputRef>(null);

  const handleKeyboardEnter = () => {
    if (selectedCategory) handleAddExpense()
  }

  return (
    <View style={$bottomSheetContainer}>
      <View style={$inputContainer}>
        <BottomSheetTextInput
          ref={firstTextInputRef as any}
          style={$modalExpenseInput}
          inputMode="numeric"
          keyboardType="number-pad"
          returnKeyType="next"
          autoComplete="off"
          placeholderTextColor={colors.palette.neutral200}
          autoCorrect={false}
          autoFocus={true}
          cursorColor={colors.palette.primary500}
          maxFontSizeMultiplier={0}
          maxLength={8}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            secondTextInputRef.current?.focus()
          }}

          onChangeText={(text) => {
            // Only allow digits
            if (/^\d+$/.test(text)) {
              setExpenseValue(text);
            } else if (text === '') {
              // Allow empty input for deletion
              setExpenseValue('');
            }
          }}
          value={expenseValue}
        />

        {/* todo dynamic currency selection */}
        <Text style={$euroSymbol} numberOfLines={1}>
          €
        </Text>
      </View>

      <View style={$noteInputContainer}>
        <Icon icon="edit" color={colors.palette.neutral400} size={typography.iconSize}/>

        <BottomSheetTextInput
          ref={secondTextInputRef as any}
          style={$modalNoteInput}
          textAlign="left"
          inputMode="text"
          returnKeyType="done"
          cursorColor={colors.palette.primary500}
          placeholder="Add a note"
          placeholderTextColor={colors.palette.neutral400}
          maxFontSizeMultiplier={0}
          maxLength={40}
          onChangeText={(value) => setNote(value)}
          onSubmitEditing={handleKeyboardEnter}
        />
      </View>

      <View style={$bottomContainer}>
        <Pressable style={$calendarContainer} onPress={() => setDateModalToggle(true)}>
          <Icon icon={"calendar"} color={colors.palette.primary500} size={typography.iconSize} />
          <Text
            style={$calendarText}
            preset="formLabel"
            text={isToday(new Date(date)) ? 'Today' : format(new Date(date), 'eee do MMM, yyyy')}
          />
        </Pressable>

        <Text style={$categoryText} preset="formLabel" tx={"addExpenseModal.categoryLabel"} />
        <View style={$categoriesContainer}>
          {categories.map(category => (
            <Tag
              id={category.id}
              label={category.label}
              key={category.id}
              onSelect={() => {
                if (selectedCategory === category.id) setSelectedCategory("")
                else setSelectedCategory(category.id)
              }}
              isSelected={selectedCategory === category.id} />
          ))}
        </View>

        <Button text="Add Expense" onPress={handleAddExpense} preset="filled" />
      </View>
    </View>
  )
}

export default AddExpenseView

const $categoryText: TextStyle = {
  fontFamily: typography.primary.medium,
}

const $bottomContainer: ViewStyle = {
  flexGrow: 1,
  width: '100%',
  justifyContent: "flex-end",
  paddingHorizontal: spacing.lg,
}

const $bottomSheetContainer : ViewStyle = {
  flex: 1,
  padding: 10,
  alignItems: 'center',
  marginBottom: spacing.md,
}

const $modalIndicator: ViewStyle = {
  backgroundColor: colors.palette.primary500,
}

const $modalExpenseInput: TextStyle = {
  alignSelf: "stretch",
  textAlign: "center",
  marginTop: spacing.sm,
  marginBottom: spacing.lg,
  fontFamily: typography.primary.normal,
  fontSize: 46,
  lineHeight: 56, // Should be larger than fontSize
  minWidth: 48,
  color: colors.palette.neutral700,
  backgroundColor: colors.palette.neutral100,
  includeFontPadding: false, // Add this to prevent padding issues
  padding: 0, // Add this to ensure no extra padding
  textAlignVertical: 'center', // Add this for better vertical alignment
  height: 60, // Add a fixed height to prevent shifting
}

const $modalNoteInput: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 16,
  color: colors.palette.neutral700,
  width: "100%",
}

const $inputContainer: ViewStyle = {
  flexDirection: "row",
  gap: spacing.xs,
  alignItems: "center",
  justifyContent: "flex-start",
}

const $euroSymbol: TextStyle = {
  fontSize: 46,
  lineHeight: 50,
  color: colors.palette.neutral700,
  fontFamily: typography.primary.normal,
}

const $noteInputContainer: ViewStyle = {
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
  maxWidth: "90%"
}

const $categoriesContainer: ViewStyle = {
  marginVertical: spacing.md,
  flexDirection: "row",
  gap: spacing.sm,
  alignItems: "center",
  justifyContent: "flex-start",
  flexWrap: "wrap",
}

const $calendarContainer: ViewStyle = {
  flexDirection: "row",
  gap: spacing.xs,
  justifyContent: "flex-start",
  alignItems: "center",
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.sm,
  marginBottom: spacing.md,
  borderWidth: 1,
  borderColor: colors.palette.primary500,
  borderRadius: spacing.xxs,
}

const $calendarText: TextStyle = {
  color: colors.palette.primary500,
}