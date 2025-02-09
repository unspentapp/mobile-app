import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button, Icon, Text } from "app/components"
import { Pressable, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { colors, spacing, typography } from "app/theme"
import { isToday } from "date-fns"
import format from "date-fns/format"
import { Tag } from "app/components/Tag"
import { getCategories } from "assets/data"
import { CalendarModal } from "app/screens/ExpensesScreen/CalendarModal"



type TransactionType = 'expense' | 'income'

type BottomSheetTextInputRef = TextInput;

type AddTransactionViewProps = {
  type: TransactionType
  onAddTransaction: (
    expenseValue: string,
    note: string,
    selectedCategory: string,
    date: string,
    type: TransactionType
  ) => void
  index: number,
  isModalOpen: boolean
}

const AddTransactionView: React.FC<AddTransactionViewProps> = ({ type, onAddTransaction, index, isModalOpen }) => {

  const [expenseValue, setExpenseValue] = useState("")
  const [note, setNote] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [dateModalToggle, setDateModalToggle] = useState(false)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const categories = useMemo(() => getCategories(), [])

  const firstTextInputRef = useRef<BottomSheetTextInputRef>(null);
  const secondTextInputRef = useRef<BottomSheetTextInputRef>(null);
  const lastIndexRef = useRef(index);

  const handleAddTransaction = useCallback(() => {
    onAddTransaction(expenseValue, note, selectedCategory, date, type)

    // Reset form after adding transaction
    setDate(format(new Date(), 'yyyy-MM-dd'))
    setSelectedCategory("")
    setExpenseValue("")
    setNote("")
  }, [expenseValue, note, selectedCategory, date, type, onAddTransaction])

  const handleKeyboardEnter = () => {
    if (selectedCategory) handleAddTransaction()
  }

  // @ts-ignore
  useEffect(() => {
    if (lastIndexRef.current !== index) {
      const timeoutId = setTimeout(() => {
        firstTextInputRef.current?.focus();
      }, 300);
      lastIndexRef.current = index;
      return () => clearTimeout(timeoutId);
    }
  }, [index, isModalOpen]);

  return (
    <View style={$bottomSheetContainer}>
      <CalendarModal
        visible={dateModalToggle}
        onClose={() => setDateModalToggle(false)}
        date={date}
        setDate={setDate}
      />

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
          cursorColor={colors.palette.primary500}
          selectionColor={colors.palette.primary100}
          selectionHandleColor={colors.palette.primary500}
          maxFontSizeMultiplier={0}
          maxLength={8}
          // submitBehavior={"blurAndSubmit"}
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

        {type === "expense" ? (
          <View>
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
          </View>
          ) : null
        }

        <Button
          onPress={handleAddTransaction}
          preset="filled"
        >
          <Text style={$addTransactionText}>{type === "expense" ? "Add Expense" : "Add Income"}</Text>
        </Button>
      </View>
    </View>
  )
}

export default AddTransactionView

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

const $addTransactionText: TextStyle = {
  fontFamily: typography.primary.semiBold,
}