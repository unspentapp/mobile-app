import React, { FC, useCallback, useMemo, useRef, useState } from "react"
import {
  Animated,
  BackHandler,
  Dimensions,
  ScrollView, TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Icon, Text } from "app/components"
import { colors, spacing } from "app/theme"
import { MainTabScreenProps } from "app/navigators/MainNavigator"
import {
  BottomSheetModal,
} from "@gorhom/bottom-sheet"
import { CalendarModal } from "app/screens/ExpensesScreen/CalendarModal"
import format from "date-fns/format"
import { useFocusEffect } from "@react-navigation/native"
import { DynamicHeader } from "app/components/DynamicHeader"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import CategoryCard from "app/screens/ExpensesScreen/CategoryCard"
import { NewExpenseModal } from "app/screens/ExpensesScreen/NewExpenseModal"
import { getCategories } from "assets/data"
import { TransactionDataI } from "db/useWmStorage"
import { useWmStorage } from "../../../db/useWmStorage"
import database from "../../../db"
import Toast from "react-native-toast-message"
import AddTransactionModal from "app/screens/ExpensesScreen/AddTransactionModal"


const HEADER_HEIGHT = 250
const ROUND_BUTTON_SIZE = 56
const USERNAME = "Amie"

interface ExpensesScreenProps extends MainTabScreenProps<"ExpensesNavigator"> {}

export const HomeScreen: FC<ExpensesScreenProps> = (props) => {
  const { navigation } = props

  // Refs
  const scrollOffsetY = useRef(new Animated.Value(0)).current // value for dynamic header
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const scrollViewRef = useRef<ScrollView>(null)

  // States
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)

  const [cardHeights, setCardHeights] = useState<Record<string, number>>({})

  // Hooks
  const { bottom } = useSafeAreaInsets()
  const { height: screenHeight } = Dimensions.get('window')


  // Memoized values
  const categories = useMemo(() => getCategories(), [])
  const totalCardsHeight = useMemo(() =>
      Object.values(cardHeights).reduce((sum, height) => sum + height, 0),
    [cardHeights]
  )

  // Constants
  const tabBarSpacing = bottom + 55
  const totalExpenses = 1245

  // Handlers
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0) {
      setIsExpenseModalOpen(false)
    } else if (index === -1) {
      setIsExpenseModalOpen(true)
    }
  }, [])


  // Navigation
  const navigateToAllTransactions = () => navigation.navigate("AllTransactions")


  return (
    <View style={$container}>
      {/*<CalendarModal
        visible={dateModalToggle}
        onClose={() => setDateModalToggle(false)}
        date={date}
        setDate={setDate}
      />*/}

      {/*<NewExpenseModal
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
        handleAddIncome={handleAddExpense}
      />*/}
      <AddTransactionModal
        bottomSheetModalRef={bottomSheetModalRef}
        handleSheetChanges={handleSheetChanges}
        //expenseValue={expenseValue}
        //setExpenseValue={setExpenseValue}
        //setNote={setNote}
        // date={date}
        // setDate={setDate}
        // setDateModalToggle={setDateModalToggle}
        //selectedCategory={selectedCategory}
       // setSelectedCategory={setSelectedCategory}
        //handleAddExpense={handleAddExpense}
        // handleAddIncome={handleAddExpense}
      />


      {/* <Text
          testID="expenses-heading"
          style={$expensesHeading}
          text={`expensesScreen.title ${userName}`}
          preset="heading"
        /> */}


      <DynamicHeader value={scrollOffsetY} name={USERNAME} />
      <ScrollView
        style={$scrollViewContainer}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + spacing.lg,
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
        <View style={$goToTransactionsContainer}>
          <TouchableOpacity
            onPress={navigateToAllTransactions}
          >
            <Text tx="expensesScreen.seeAll" preset="formLabel" style={$goToTransactions} />
          </TouchableOpacity>
        </View>
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            onHeightChange={(height: number) => setCardHeights(prev => ({ ...prev, [category.id]: height }))}
            totalExpenses={totalExpenses}
            animationDelay={index * 50}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[$roundButton, { bottom: spacing.lg + bottom }]}
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
  height: ROUND_BUTTON_SIZE,
  width: ROUND_BUTTON_SIZE,
  padding: 20,
  borderRadius: ROUND_BUTTON_SIZE / 2,
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

const $goToTransactions: TextStyle = {
  marginBottom: spacing.lg,
}

const $goToTransactionsContainer: ViewStyle = {
  width: '100%',
  alignItems: "flex-end",
}










