import React, { FC, useCallback, useRef, useState } from "react"
import {
  Animated,
  BackHandler, FlatList, Image, ImageStyle,
  Pressable, ScrollView,
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
import { logger, randomId } from "@nozbe/watermelondb/utils/common"
import { Tag } from "app/components/Tag"
import { CalendarModal } from "app/screens/ExpensesScreen/CalendarModal"
import format from "date-fns/format"
import { isToday } from "date-fns"
import { useFocusEffect } from "@react-navigation/native"
import { Category } from "app/models/Category"
import { getCategories, getExpenses } from "assets/data"
import { Expense } from "app/models/Expense"
import { useExpensesStore } from "app/store/ExpensesStore"
import profilePic from "../../../assets/images/profile-pic.jpg"
import { DynamicHeader } from "app/components/DynamicHeader"
import { StatusBar } from "expo-status-bar"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useCategoriesStore } from "app/store/CategoriesStore"


type BottomSheetTextInputRef = TextInput;
interface ExpensesScreenProps extends MainTabScreenProps<"ExpensesNavigator"> {}

export const ExpensesScreen: FC<ExpensesScreenProps> = (props) => {
  const { navigation } = props
  const logout = useStore((state) => state.logout)

  // value for dynamic header
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  function goSettings() {
    navigation.navigate("Settings")
  }

/*  useHeader({
      leftIcon: "menu",
      rightIcon: "settings",
      onRightPress: goSettings,
  }, [logout])*/

  const userName = "Amie"
  // const categories: Category[] = getCategories()
  // const expenses: Expense[] = getExpenses()

  /* Bottom Sheet Modal ref */
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  /* Bottom Sheet Modal callbacks */
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [dateModalToggle, setDateModalToggle] = useState(false)

  const [expenseValue, setExpenseValue] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [date, setDate] = useState<string>(format(new Date, 'yyyy-MM-dd'))
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const handleAddExpense = () => {
    const expense: Expense = {
      categoryId: selectedCategory.toString(),
      description: note,
      value: parseInt(expenseValue),
      recurrent: false,
      date: date,
      type: "",
      id: randomId()
    }

    addExpense(expense)
    logger.log(`Expenses added: ${note} - ${expenseValue} €, ${date}, Category: ${selectedCategory}`)
    bottomSheetModalRef.current?.close();
    setDate(format(new Date, 'yyyy-MM-dd'))
    setSelectedCategory("")
  }

  const handleKeyboardEnter = () => {
    if (selectedCategory) handleAddExpense()
  }

  const handleSheetChanges = (index: number) => {
    if (index === 0) {
      setDate(format(new Date, 'yyyy-MM-dd'))
      setSelectedCategory("")
      setIsExpenseModalOpen(false)
    }
    else if (index === -1) setIsExpenseModalOpen(true)
    console.log('handleSheetChanges', index);
    console.log('IS ADD EXPENSE MODAL OPEN', isExpenseModalOpen);
  };

  const firstTextInputRef = useRef<BottomSheetTextInputRef>(null);
  const secondTextInputRef = useRef<BottomSheetTextInputRef>(null);


  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        bottomSheetModalRef.current?.close();
        setDateModalToggle(false)

        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [dateModalToggle, isExpenseModalOpen])
  );

  const getCategoryName = (expense: Expense) => {
    if (expense.categoryId === "") return ""
    return categories.filter(category => category.id === expense.categoryId)[0]
  }

  const { expenses, addExpense, removeExpense } = useExpensesStore()
  const { categories } = useCategoriesStore()
  const { bottom } = useSafeAreaInsets()


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
        animateOnMount={true}
        onChange={handleSheetChanges}
        handleIndicatorStyle={$modalIndicator}
        // keyboardBehavior="fillParent"
        android_keyboardInputMode="adjustResize"
        snapPoints={['100%']}
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
            <Icon icon="edit" color={colors.palette.neutral400} size={22}/>

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
              <Icon icon={"calendar"} color={colors.palette.primary500} size={22} />
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
        </BottomSheetView>
      </BottomSheetModal>



      {/* <Text
          testID="expenses-heading"
          style={$expensesHeading}
          text={`expensesScreen.title ${userName}`}
          preset="heading"
        /> */}

      <TouchableOpacity style={[$roundButton, {  bottom: spacing.lg + bottom,}]} onPress={handlePresentModalPress}>
        <Icon icon={"plus"} color={colors.palette.neutral100} />
      </TouchableOpacity>

      <View>
        <DynamicHeader value={scrollOffsetY} name={userName} />
        <ScrollView
          style={$expensesListScrollView}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
            {
              useNativeDriver: false,
            },
          )}
          >
          <View style={$expensesContainer}>
            {expenses.map(expense => (
              <ExpenseCard onPress={() => removeExpense(expense)} expense={expense} key={expense.id} category={getCategoryName(expense)}/>
            ))}
          </View>
        </ScrollView>

      </View>
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
  // backgroundColor: 'blue' // test!
}

const $expensesContainer: ViewStyle = {
  justifyContent: "flex-start",
  paddingHorizontal: spacing.lg,

}

const $roundButton: ViewStyle = {
  position: "absolute",
  right: spacing.lg,
  elevation: 3, // android shadow
  height: 56,
  width: 56,
  padding: 20,
  borderRadius: 50,
  backgroundColor: colors.palette.primary500,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
  // iOS shadow
  shadowColor: "#000", // For iOS shadow
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
}

/* header */
const $expensesListScrollView: ViewStyle = {
  paddingTop: 250
}

/*
* Bottom Sheet Modal
* */
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
  marginTop: spacing.lg,
  marginBottom: spacing.lg,
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









