import React, { FC, useCallback, useMemo, useRef, useState } from "react"
import {
  Animated,
  BackHandler,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Icon } from "app/components"
import { colors, spacing } from "app/theme"
import { useStore } from "app/store"
import { MainTabScreenProps } from "app/navigators/MainNavigator"
import {
  BottomSheetModal,
} from "@gorhom/bottom-sheet"
import { CalendarModal } from "app/screens/ExpensesScreen/CalendarModal"
import format from "date-fns/format"
import { useFocusEffect } from "@react-navigation/native"
import { Expense } from "app/models/Expense"
import { useExpensesStore } from "app/store/ExpensesStore"
import { DynamicHeader } from "app/components/DynamicHeader"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useCategoriesStore } from "app/store/CategoriesStore"
import CategoryCard from "app/screens/ExpensesScreen/CategoryCard"
import { NewExpenseModal } from "app/screens/ExpensesScreen/NewExpenseModal"
import * as Crypto from 'expo-crypto';
const logger = require('pino')()


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
  }, [logout]) */

  const userName = "Amie"


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
      date,
      type: "",
      id: Crypto.randomUUID()
    }

    addExpense(expense)

    logger.log(`Expenses added: ${note} - ${expenseValue} €, ${date}, Category: ${selectedCategory}`)
    bottomSheetModalRef.current?.close();
    setDate(format(new Date, 'yyyy-MM-dd'))
    setSelectedCategory("")
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

  const { expenses, addExpense, removeExpense, totalExpenses } = useExpensesStore()
  const { categories } = useCategoriesStore()

  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [cardHeights, setCardHeights] = useState<Record<string, number>>({});
  const { height: screenHeight } = Dimensions.get('window');
  const totalCardsHeight = useMemo(() =>
      Object.values(cardHeights).reduce((sum, height) => sum + height, 0),
    [cardHeights]
  );



  const { bottom } = useSafeAreaInsets()

  const tabBarSpacing = bottom + 55
  const scrollViewRef = useRef<ScrollView>(null)


  return (
    <View style={$container}>
      <CalendarModal
        visible={dateModalToggle}
        onClose={() => setDateModalToggle(false)}
        date={date}
        setDate={setDate}
      />

      <NewExpenseModal
        bottomSheetModalRef={bottomSheetModalRef}
        handleSheetChanges={handleSheetChanges}
        expenseValue={expenseValue}
        setExpenseValue={setExpenseValue}
        setNote={setNote}
        date={date}
        setDateModalToggle={setDateModalToggle}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleAddExpense={handleAddExpense}
      />


      {/* <Text
          testID="expenses-heading"
          style={$expensesHeading}
          text={`expensesScreen.title ${userName}`}
          preset="heading"
        /> */}


      <DynamicHeader value={scrollOffsetY} name={userName} />
      <ScrollView
        style={$scrollViewContainer}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 250 + spacing.lg,
          paddingHorizontal: spacing.lg,
          minHeight: totalCardsHeight + screenHeight - tabBarSpacing
        }}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
          {useNativeDriver: false}
        )}
        ref={scrollViewRef}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: undefined,
        }}
      >
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            onHeightChange={(height: number) => setContainerHeight(height)}
            totalExpenses={totalExpenses}
            animationDelay={index * 50}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[$roundButton, {  bottom: spacing.lg + bottom,}]}
        onPress={handlePresentModalPress}
        testID="addExpenseButton"
        >
        <Icon icon={"plus"} color={colors.palette.neutral100} />
      </TouchableOpacity>

    </View>
  )
}



const $container: ViewStyle = {
  // flex: 1,
  backgroundColor: colors.background,
  // backgroundColor: 'blue' // test!
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

const $scrollViewContainer: ViewStyle = {
  // backgroundColor: "red",
  // paddingTop: 250 + spacing.lg, // 250 is for the header animation
  // paddingHorizontal: spacing.lg,
  // paddingVertical: spacing.md,
}











