import React, { FC, useCallback, useMemo, useRef, useState } from "react"
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Button, Icon, Text } from "app/components"
import { colors, spacing, typography } from "app/theme"
import { useHeader } from "app/utils/useHeader"
import { useStore } from "app/store"
import { MainTabScreenProps } from "app/navigators/MainNavigator"
import { ExpenseCard } from "app/screens/ExpensesScreen/ExpenseCard"
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView
} from "@gorhom/bottom-sheet"
import { logger } from "@nozbe/watermelondb/utils/common"
import { Tag } from "app/components/Tag"
import { CalendarModal } from "app/screens/ExpensesScreen/CalendarModal"
import format from "date-fns/format"
import { isEqual, toDate } from "date-fns/fp"
import { getDate, getISODay, isToday, parse } from "date-fns"
import { parseDate } from "react-native-calendars/src/interface"
import { formatDate } from "app/utils/formatDate"


type BottomSheetTextInputRef = TextInput;

interface ExpensesScreenProps extends MainTabScreenProps<"Expenses"> {}

export const ExpensesScreen: FC<ExpensesScreenProps> = (props) => {
  const { navigation } = props
  const logout = useStore((state) => state.logout)

  function goSettings() {
    navigation.navigate("Settings")
  }

  useHeader({
      leftIcon: "menu",
      rightIcon: "settings",
      onRightPress: goSettings,
  }, [logout])

  const [expenseValue, setExpenseValue] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [date, setDate] = useState<string>(format(new Date, 'yyyy-MM-dd'))
  const [dateModalToggle, setDateModalToggle] = useState(false)

  // todo dynamic category selection
  const [category, setCategory] = useState<boolean>(true)

  const handleAddExpense = () => {
    logger.log(`Expenses added: ${note} - ${expenseValue} €, ${date}`)
    bottomSheetModalRef.current?.close();
  }

  const handleKeyboardEnter = () => {
    if (category) handleAddExpense()
  }

  /* Bottom Sheet Modal ref */
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  /* Bottom Sheet Modal callbacks */
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) setDate(format(new Date, 'yyyy-MM-dd'))
    console.log('handleSheetChanges', index);
  }, []);

  const firstTextInputRef = useRef<BottomSheetTextInputRef>(null);
  const secondTextInputRef = useRef<BottomSheetTextInputRef>(null);


  return (
    <View style={$container}>

      <CalendarModal
        visible={dateModalToggle}
        onClose={() => setDateModalToggle(false)}
        date={date}
        setDate={setDate}
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        handleIndicatorStyle={$modalIndicator}
        keyboardBehavior="fillParent"
        android_keyboardInputMode="adjustResize"

      >

        <BottomSheetView style={$bottomSheetContainer}>
          <Text>Add new expense</Text>
          <View style={$inputContainer}>
            <BottomSheetTextInput
              ref={firstTextInputRef as any}
              style={$modalExpenseInput}
              inputMode="numeric"
              returnKeyType="next"
              autoComplete="off"
              placeholderTextColor={colors.palette.neutral200}
              autoCorrect={false}
              autoFocus={true}
              cursorColor={colors.palette.primary500}
              maxFontSizeMultiplier={0}
              maxLength={8}
              onChangeText={(value) => setExpenseValue(value)}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                secondTextInputRef.current?.focus()
              }}
            />

            {/* todo dynamic currency selection */}
            <Text style={$euroSymbol} numberOfLines={1}>
              €
            </Text>
          </View>

          <View style={$noteInputContainer}>
            <Icon icon="edit" color={colors.palette.neutral400} />

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
              <Icon icon={"calendar"} color={colors.palette.primary500} />
              <Text
                style={$calendarText}
                preset="formLabel"
                text={isToday(new Date(date)) ? 'Today' : format(new Date(date), 'eee do MMM, yyyy')}
              />

            </Pressable>

            <Text style={$categoryText} preset="formLabel" tx={"addExpenseModal.categoryLabel"} />
            <View style={$categoriesContainer}>
              <Tag />
              <Tag />
              <Tag />
              <Tag />
              <Tag />
            </View>

            <Button text="Add Expense" onPress={handleAddExpense} preset="filled" />
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      <View style={$topContainer}>
        <Text
          testID="expenses-heading"
          style={$expensesHeading}
          tx="expensesScreen.title"
          preset="heading"
        />
      </View>
      <View style={$expensesContainer}>
        <ExpenseCard name={"Grocery"} value={55} />
        <ExpenseCard name={"Grocery"} value={55} />
        <ExpenseCard name={"Grocery"} value={55} />
        <ExpenseCard name={"Grocery"} value={55} />
        <ExpenseCard name={"Grocery"} value={55} />
      </View>

      <TouchableOpacity style={$roundButton} onPress={handlePresentModalPress}>
        <Icon icon={"plus"} color={colors.palette.neutral100} />
      </TouchableOpacity>
    </View>
  )
}

/* COMMON */
const $categoryText: TextStyle = {
  fontFamily: typography.primary.medium,
}


const $bottomContainer: ViewStyle = {
  flexGrow: 1,
  width: '100%',
  justifyContent: "flex-end",
  paddingHorizontal: spacing.lg,
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  justifyContent: "flex-start",
  paddingHorizontal: spacing.lg,
}

const $expensesHeading: TextStyle = {
  marginBottom: spacing.md,
}

const $expensesContainer: ViewStyle = {
  flex: 1,
  flexShrink: 1,
  flexGrow: 1,
  justifyContent: "flex-start",
  paddingHorizontal: spacing.lg,

}

const $roundButton: ViewStyle = {
  position: "absolute",
  right: spacing.lg,
  bottom: spacing.lg,
  height: 56,
  width: 56,
  padding: 20,
  borderRadius: 50,
  backgroundColor: colors.palette.primary500,
  alignItems: "center",
  justifyContent: "center",
}

/*
* Bottom Sheet Modal
* */
const $bottomSheetContainer : ViewStyle = {
  flex: 1,
  padding: 10,
  alignItems: 'center',
}

const $modalIndicator: ViewStyle = {
  backgroundColor: colors.palette.primary500,
}

const $modalExpenseInput: TextStyle = {
  alignSelf: "stretch",
  textAlign: "center",
  marginTop: spacing.xs,
  marginBottom: 10,
  borderRadius: 10,
  fontFamily: typography.primary.normal,
  fontSize: 46,
  lineHeight: 28,
  minWidth: 48,
  color: colors.palette.neutral700,
  backgroundColor: colors.palette.neutral100,
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
  color: colors.palette.neutral700,
  fontFamily: typography.primary.normal,
  paddingTop: spacing.xl,
}

const $noteInputContainer: ViewStyle = {
  flexDirection: 'row',
  gap: spacing.xs,
  justifyContent: 'flex-start',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: colors.palette.neutral200,
  marginTop: 8,
  marginBottom: 10,
  borderRadius: 10,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  minWidth: "50%",
  maxWidth: "90%"
}

const $categoriesContainer: ViewStyle = {
  marginVertical: spacing.md,
  flexDirection: "row",
  gap: 14,
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
  marginBottom: spacing.xs,
  borderWidth: 1,
  borderColor: colors.palette.primary500,
  borderRadius: 8,
}

const $calendarText: TextStyle = {
  color: colors.palette.primary500,
  fontWeight: typography.primary.medium,
}
