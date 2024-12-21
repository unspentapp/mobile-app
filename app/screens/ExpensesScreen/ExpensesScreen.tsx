import React, { FC, useCallback, useRef, useState } from "react"
import { TextInput, TextStyle, View, ViewStyle } from "react-native"
import { Button, Icon, Text } from "app/components"
import { colors, spacing, typography } from "app/theme"
import { useHeader } from "app/utils/useHeader"
import { useStore } from "app/store"
import { MainTabScreenProps } from "app/navigators/MainNavigator"
import { ExpenseCard } from "app/screens/ExpensesScreen/ExpenseCard"
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { logger } from "@nozbe/watermelondb/utils/common"
import { Tag } from "app/components/Tag"

type BottomSheetTextInputRef = TextInput;

interface ExpensesScreenProps extends MainTabScreenProps<"Expenses"> {}

export const ExpensesScreen: FC<ExpensesScreenProps> = (props) => {
  const { navigation } = props
  const logout = useStore((state) => state.logout)

  const [expenseValue, setExpenseValue] = useState<string>("")
  const [note, setNote] = useState<string>("")

  // todo dynamic category selection
  const [category, setCategory] = useState<boolean>(true)

  const handleAddExpense = () => {
    logger.log(`Expenses added: ${note} - ${expenseValue} €`)
    bottomSheetModalRef.current?.close();
  }

  const handleKeyboardEnter = () => {
    if (category) handleAddExpense()
  }

  function goSettings() {
    navigation.navigate("Settings")
  }

  /* Bottom Sheet Modal ref */
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  /* Bottom Sheet Modal callbacks */
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
/*  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []) */

  const firstTextInputRef = useRef<BottomSheetTextInputRef>(null);
  const secondTextInputRef = useRef<BottomSheetTextInputRef>(null);



  useHeader({
      leftIcon: "menu",
      rightIcon: "settings",
      onRightPress: goSettings,
  }, [logout])

  return (

      <GestureHandlerRootView style={$container}>
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
            handleIndicatorStyle={$modalIndicator}
            keyboardBehavior="fillParent"
            android_keyboardInputMode="adjustResize"
          >
            <BottomSheetView
              style={$bottomSheetContainer}
            >
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
                  onChangeText={value => setExpenseValue(value)}
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    secondTextInputRef.current?.focus();
                  }}
                />

                {/* todo dynamic currency selection */}
                <Text
                  style={$euroSymbol}
                  numberOfLines={1}
                >
                  €
                </Text>
              </View>

              <View style={$noteInputContainer}>
                <Icon icon="heart" />

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
                  onChangeText={value => setNote(value)}
                  onSubmitEditing={handleKeyboardEnter}
                />
              </View>


              <View style={$bottomContainer}>
                <Text
                  style={$categoryText}
                  preset="formLabel"
                  tx={"addExpenseModal.categoryLabel"}
                />
                <View
                  style={$categoriesContainer}
                >
                  <Tag />
                  <Tag />
                  <Tag />
                  <Tag />
                  <Tag />

                </View>

                <Button
                  text="Add Expense"
                  onPress={handleAddExpense}
                  preset="filled"
                />
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
            <ExpenseCard name={"Grocery"} value={55}/>
            <ExpenseCard name={"Grocery"} value={55}/>
            <ExpenseCard name={"Grocery"} value={55}/>
            <ExpenseCard name={"Grocery"} value={55}/>
            <ExpenseCard name={"Grocery"} value={55}/>
          </View>


          <Button
            style={$roundButton}
            onPress={handlePresentModalPress}
          >
            <Icon icon={"plus"} color={colors.palette.neutral100} />
          </Button>
        </BottomSheetModalProvider>

      </GestureHandlerRootView>

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
  alignSelf: "flex-end",
  height: 70,
  width: 70,
  borderRadius: 35,
  borderWidth: 0,
  // zIndex: 1,
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
