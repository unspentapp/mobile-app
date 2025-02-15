import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Animated,
  Dimensions, Image, ImageStyle, Modal,
  ScrollView, TextInput, TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Header, Icon, Text, TextField, Screen } from "app/components"
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
import AddCategoryModal from "app/screens/Transactions/AddCategoryModal"
import { useHeader } from "app/utils/useHeader"
import { goBack } from "app/navigators"
import profilePic from "assets/images/profile-pic.jpg"
import { StatusBar } from "expo-status-bar"
import MonthReviewCard from "app/screens/MonthReviewCard"



const HEADER_HEIGHT = 200
const ROUND_BUTTON_SIZE = 56
const USERNAME = "Amie"

interface ExpensesScreenProps extends MainTabScreenProps<"ExpensesNavigator"> {
  transactions: TransactionDataI[]
  categories: CategoryDataI[]
}

type BottomSheetTextInputRef = TextInput


const HomeScreen: FC<ExpensesScreenProps> = ({ transactions, categories, ...props }) => {
  const { navigation } = props

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const addCategorySheetRef = useRef<BottomSheetModal>(null);
  const addCategoryInputRef = useRef<BottomSheetTextInputRef>(null)

  // States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState<number>(0)

  // Hooks
  const { bottom } = useSafeAreaInsets()

  // Constants
  // const tabBarSpacing = bottom + 55

  // Handlers
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
    setIsModalOpen(true)
  }, [])

  const handleModalDismiss = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handlePresentNewCategorySheet = useCallback(() => {
    addCategorySheetRef.current?.present()
    addCategoryInputRef.current?.focus()
  }, [])

  // Navigation
  const navigateToAllTransactions = () => navigation.navigate("AllTransactions")

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

  const { top } = useSafeAreaInsets()



  /* todo qui dentro posso metterci lo sfondo */
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={{ flex: 1, paddingTop: top }}>
        <AddTransactionModal
          bottomSheetModalRef={bottomSheetModalRef}
          isOpen={isModalOpen}
          onDismiss={handleModalDismiss}
        />

        <AddCategoryModal
          addCategorySheetRef={addCategorySheetRef}
          addCategoryInputRef={addCategoryInputRef}
        />

        <View style={$topContainer}>
          <MonthReviewCard
            totalMonthlyExpenses={totalMonthlyExpenses}
          />
        </View>

        <ScrollView
          style={$scrollViewContainer}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
          }}
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

          {groupedTransactions.size > 1 ? [...groupedTransactions].map(([categoryId, categoryTransactions], index) => {
            // Find the category object or create an "Unknown" category for null cases
            const category = categoryId === 'unknown'
              ? { id: 'unknown', name: 'Uncategorized', color: colors.textDim, type: 'expense' }
              : categories.find(c => c.id === categoryId);

            if (!category) return null;
            if (categoryId === 'unknown' && categoryTransactions.length === 0) return null;

            return (
              <EnhancedCategoryCard
                key={categoryId}
                categoryId={category.id}
                categoryName={category.name}
                transactions={categoryTransactions}
                totalAmount={categoryExpenses.get(categoryId) || 0}
                totalExpenses={totalMonthlyExpenses || 0}
                animationDelay={index * 50}
              />
            );
          }) : null }

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

const $topContainer: ViewStyle = {
  justifyContent: "flex-start",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xs
}

const $container: ViewStyle = {
  flex: 1,
  // backgroundColor: colors.background,
  // padding: 24,
  // backgroundColor: 'red' // test!
}

const $roundButton: ViewStyle = {
  position: "absolute",
  right: spacing.lg,
  bottom: spacing.lg,
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
  // marginTop: spacing.md,
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













