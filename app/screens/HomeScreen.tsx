import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Animated,
  Dimensions, Modal,
  ScrollView, TextInput, TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Icon, Text, TextField } from "app/components"
import { colors, spacing, typography } from "app/theme"
import { MainTabScreenProps } from "app/navigators/MainNavigator"
import BottomSheet, {
  BottomSheetModal, BottomSheetTextInput, BottomSheetView, useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet"
import { DynamicHeader } from "app/components/DynamicHeader"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import AddTransactionModal from "app/screens/Transactions/AddTransactionModal"
import EnhancedCategoryCard from "app/screens/Transactions/CategoryCard"
import CategoryModel from "../../db/models/CategoryModel"
import { withObservables } from "@nozbe/watermelondb/react"
import database from "../../db"
import { Q } from "@nozbe/watermelondb"
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns"
import { CategoryDataI, TransactionDataI } from "../../db/useWmStorage"
import AddCategoryModal from "app/AddCategoryModal"


const HEADER_HEIGHT = 250
const ROUND_BUTTON_SIZE = 56
const USERNAME = "Amie"

interface ExpensesScreenProps extends MainTabScreenProps<"ExpensesNavigator"> {
  transactions: TransactionDataI[]
  categories: CategoryDataI[]
}

const HomeScreen: FC<ExpensesScreenProps> = ({ transactions, categories, ...props }) => {
  const { navigation } = props

  // Refs
  const scrollOffsetY = useRef(new Animated.Value(0)).current // value for dynamic header
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const addCategorySheetRef = useRef<BottomSheetModal>(null);
  const scrollViewRef = useRef<ScrollView>(null)

  // States
  const [cardHeights, setCardHeights] = useState<Record<string, number>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState<number>()

  // Hooks
  const { bottom } = useSafeAreaInsets()
  const { height: screenHeight } = Dimensions.get("window")

  // Memoized values
  const totalCardsHeight = useMemo(
    () => Object.values(cardHeights).reduce((sum, height) => sum + height, 0),
    [cardHeights],
  )

  // Constants
  const tabBarSpacing = bottom + 55

  // Handlers
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
    setIsModalOpen(true)
  }, [])

  const handleModalDismiss = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  // Navigation
  const navigateToAllTransactions = () => navigation.navigate("AllTransactions")



  const handlePresentNewCategorySheet = useCallback(() => {
    addCategorySheetRef.current?.present()
  }, [])

/*  const handlePresentNewCategorySheet = () => {
    addCategorySheetRef.current?.present()
  }*/

  useEffect(() => {
    const totalExpenses = transactions.reduce((total, transaction) => total + transaction.amount, 0)
    setTotalMonthlyExpenses(totalExpenses)

  }, [transactions])

  // Add this memoized value to group transactions by category
  const groupedTransactions = useMemo(() => {
    const grouped = new Map<string, TransactionDataI[]>();

    // Initialize with existing categories
    categories.forEach(category => {
      grouped.set(category.id, []);
    });

    // Add an "unknown" category for null category transactions
    grouped.set('unknown', []);

    // Group transactions
    transactions.forEach(transaction => {
      const categoryId = transaction.category?.id || 'unknown';
      const categoryTransactions = grouped.get(categoryId) || [];
      categoryTransactions.push(transaction);
      grouped.set(categoryId, categoryTransactions);
    });

    return grouped;
  }, [transactions, categories]);

  // Calculate category expenses
  const categoryExpenses = useMemo(() => {
    const expenses = new Map<string, number>();

    groupedTransactions.forEach((transactions, categoryId) => {
      const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      expenses.set(categoryId, total);
    });

    return expenses;
  }, [groupedTransactions]);



  return (
    <View style={$container}>
      <AddTransactionModal
        bottomSheetModalRef={bottomSheetModalRef}
        isOpen={isModalOpen}
        onDismiss={handleModalDismiss}
      />

      <AddCategoryModal
        addCategorySheetRef={addCategorySheetRef}
      />


      <DynamicHeader
        value={scrollOffsetY}
        totalExpenses={totalMonthlyExpenses || 0}
        name={USERNAME} />

      <ScrollView
        style={$scrollViewContainer}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + spacing.lg,
          paddingHorizontal: spacing.lg,
          minHeight: totalCardsHeight + screenHeight - tabBarSpacing,
        }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
          useNativeDriver: false,
        })}
        ref={scrollViewRef}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: undefined,
        }}
      >
        <View style={$goToTransactionsContainer}>
          <TouchableOpacity onPress={navigateToAllTransactions}>
            <Text tx="homeScreen.seeAll" preset="formLabel" style={$goToTransactions} />
          </TouchableOpacity>
        </View>

        {[...groupedTransactions].map(([categoryId, categoryTransactions], index) => {
          // Find the category object or create an "Unknown" category for null cases
          const category = categoryId === 'unknown'
            ? { id: 'unknown', name: 'Uncategorized', color: 'gray', type: 'expense' }
            : categories.find(c => c.id === categoryId);

          if (!category) return null;

          return (
            <EnhancedCategoryCard
              key={categoryId}
              categoryId={category.id}
              categoryName={category.name}
              transactions={categoryTransactions}
              totalAmount={categoryExpenses.get(categoryId) || 0}
              onHeightChange={(height: number) =>
                setCardHeights((prev) => ({ ...prev, [categoryId]: height }))
              }
              totalExpenses={totalMonthlyExpenses || 0}
              animationDelay={index * 50}
            />
          );
        })}

        <TouchableOpacity
          style={$addCategoryButtonContainer}
          onPress={handlePresentNewCategorySheet}
        >
            <Text tx={"homeScreen.addCategory"} style={$addNewCategoryText}/>
        </TouchableOpacity>

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

const enhance = withObservables([], () => {
  const startDate = startOfMonth(new Date)
  const endDate = endOfMonth(new Date)

  return {
    transactions: database.get("transactions").query(
      Q.where('type', 'expense'),
      Q.where('transaction_at', Q.gte(new Date(startDate).getTime())),
      Q.where('transaction_at', Q.lte(new Date(endDate).getTime())),
    ),
    categories: database.get("categories").query(),
  }
})

const EnhancedHomeScreen = enhance(HomeScreen)
// const EnhancedHomeScreen = (HomeScreen)
export default EnhancedHomeScreen

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  // padding: 24,
  // backgroundColor: 'gray' // test!
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

const $addCategoryButtonContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.lg,
  backgroundColor: colors.elevatedBackground,
  borderWidth: 1,
  borderColor: colors.border,
  marginBottom: spacing.sm,
  borderRadius: spacing.xxs,
}

const $addNewCategoryText: TextStyle = {
  fontFamily: typography.primary.medium,
  color: colors.textDim
}









