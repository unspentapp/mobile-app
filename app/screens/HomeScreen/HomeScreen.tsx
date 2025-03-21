import React, { FC, useCallback, useState } from "react"
import {
  ScrollView,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Icon, Text } from "app/components"
import { colors, spacing, typography } from "app/theme"
import { MainTabScreenProps } from "app/navigators/MainNavigator"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import AddTransactionModal from "app/screens/Transactions/AddTransactionModal"
import EnhancedCategoryCard from "app/screens/HomeScreen/CategoryCard"
import { withObservables } from "@nozbe/watermelondb/react"
import database from "../../../db"
import { Q } from "@nozbe/watermelondb"
import { endOfMonth, startOfMonth } from "date-fns"
import AddCategoryModal from "app/screens/HomeScreen/AddCategoryModal"
import MonthReviewCard from "app/screens/HomeScreen/MonthReviewCard"
import { useFocusEffect } from "@react-navigation/native"
import { ConfirmationSheet } from "app/components/ConfirmationSheet"
import CategoryModel from "../../../db/models/CategoryModel"
import { useModals } from "app/hooks/useModals"
import TransactionModel from "../../../db/models/TransactionModel"
import AnimatedBackground from "app/components/backdrops/AnimatedBackground"

const ROUND_BUTTON_SIZE = 56


interface ExpensesScreenProps extends MainTabScreenProps<"Expenses"> {
  transactions: TransactionModel[]
  categories: CategoryModel[]
}


const HomeScreen: FC<ExpensesScreenProps> = ({ transactions, categories, ...props }) => {
  const { navigation } = props
  const { top, bottom } = useSafeAreaInsets()
  const {
    modalState,
    refs,
    actions
  } = useModals()

  // States
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState<number>(0)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [processedTransactions, setProcessedTransactions] = useState<Array<{
    categoryId: string;
    category: any;
    transactions: TransactionModel[];
    totalExpensesPerCategory: number;
  }>>([]);

  // Navigation
  const navigateToAllTransactions = () => navigation.navigate("AllTransactions")

  // Use useFocusEffect to recalculate when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Calculate total expenses
      const totalExpenses = transactions.reduce((total, transaction) => total + transaction.amount, 0)
      setTotalMonthlyExpenses(totalExpenses)

      // Group transactions
      const grouped = new Map<string, TransactionModel[]>()

      // Initialize with existing categories
      categories.forEach(category => {
        grouped.set(category.id, [])
      })

      // Add an "unknown" category for null category transactions
      grouped.set('unknown', [])

      // Group transactions
      transactions.forEach(transaction => {
        const categoryId = transaction.category?.id || 'unknown'
        const categoryTransactions = grouped.get(categoryId) || []
        categoryTransactions.push(transaction)
        grouped.set(categoryId, categoryTransactions)
      })

      // Process and sort the grouped transactions
      const processedAndSorted = [...grouped]
        .map(([categoryId, categoryTransactions]) => {
          const category = categoryId === 'unknown'
            ? { id: 'unknown', name: 'Uncategorized', color: colors.textDim, type: 'expense' }
            : categories.find(c => c.id === categoryId)

          const totalExpensesPerCategory = categoryTransactions.reduce(
            (total, transaction) => total + transaction.amount, 0
          )

          if (!category) return null
          if (categoryId === 'unknown' && categoryTransactions.length === 0) return null

          return {
            categoryId,
            category,
            transactions: categoryTransactions,
            totalExpensesPerCategory
          }
        })
        .filter(Boolean) // Remove null entries
        .sort((a, b) => b.totalExpensesPerCategory - a.totalExpensesPerCategory) // Sort by expense DESC

      // Only store the processed transactions in state
      setProcessedTransactions(processedAndSorted)

    }, [transactions, categories])
  )

  const handlePresentModalPress = useCallback(() => {
    refs.bottomSheetModalRef.current?.present()
    setIsTransactionModalOpen(true)
  }, [])

  const handleDeleteCategory = async () => {
    if (!modalState.category?.id) return

    const categoryId = modalState.category.id

    try {
      await database.write(async () => {
        const categoryTransactions = await database
          .get<TransactionModel>('transactions')
          .query(
            Q.where('category_id', categoryId)
          )
          .fetch()

        // Update all transactions to remove category reference
        for (const transaction of categoryTransactions) {
          type UpdateFunction = (tx: TransactionModel) => void;
          const updateFn: UpdateFunction = (tx) => {
            tx.categoryId = null
          };
          await transaction.update(updateFn);
        }

        // Delete the category
        const categoryRecord = await database
          .get<CategoryModel>('categories')
          .find(categoryId)

        if (categoryRecord) {
          await categoryRecord.destroyPermanently()
        }
      })

      // Close modals
      actions.closeAddCategorySheet()
      actions.closeConfirmationSheet()

    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  // Custom method to close the category modal without reopening confirmation sheet
  const handleCategoryModalDismiss = useCallback(() => {
    // Make sure we only perform the dismissal once
    if (refs.addCategorySheetRef.current) {
      // Close the category sheet
      actions.closeAddCategorySheet()

      // Ensure the confirmation sheet doesn't reappear
      if (modalState.category && modalState.type === 'edit') {
        // Clear the category from modal state or update a flag to prevent reopening
        // This depends on how your useModals hook is implemented
        actions.closeConfirmationSheet()
      }
    }
  }, [modalState.category, modalState.type, actions])

  return (
    <View style={$screenContainer}>
      <AnimatedBackground
        count={4}
        customColors={[
          colors.palette.primary200,
          colors.palette.primary400,
          colors.palette.secondary100,
          colors.palette.secondary200,
        ]}
        backgroundColor={colors.palette.neutral100}
        duration={30000}
      />
      <View style={[$container, { paddingTop: top }]}>
        <AddTransactionModal
          bottomSheetModalRef={refs.bottomSheetModalRef}
          isOpen={isTransactionModalOpen}
          onDismiss={() => setIsTransactionModalOpen(false)}
        />

        <AddCategoryModal
          modalType={modalState.type}
          category={modalState.category}
          addCategorySheetRef={refs.addCategorySheetRef}
          addCategoryInputRef={refs.addCategoryInputRef}
          onDismiss={handleCategoryModalDismiss}
        />

        {modalState.category && (
          <ConfirmationSheet
            bottomSheetRef={refs.confirmationSheetRef}
            title={`Category: ${modalState.category.name}`}
            primaryButton={{
              text: "Edit",
              onPress: () => {
                // Close confirmation sheet before opening category sheet
                refs.confirmationSheetRef.current?.close()
                // Slight delay to ensure smooth transition
                setTimeout(() => {
                  actions.openAddCategorySheet('edit', modalState.category)
                }, 200)
              },
              style: {backgroundColor: colors.palette.neutral300 },
              textStyle: { color: colors.text },
            }}
            secondaryButton={{
              text: "Delete",
              style: {backgroundColor: colors.error },
              textStyle: { color: colors.palette.neutral100 },
              onPress: handleDeleteCategory,
            }}
            onDismiss={actions.closeConfirmationSheet}
          />
        )}

        <View style={$topContainer}>
          <MonthReviewCard totalMonthlyExpenses={totalMonthlyExpenses} />
          <View style={$goToTransactionsContainer}>
            <TouchableOpacity onPress={navigateToAllTransactions} style={$goToTransactionsBtn}>
              <Text tx="homeScreen.seeAll" preset="formLabel" style={$goToTransactions} />
              <Icon icon={"back"} color={colors.text} size={typography.iconSize} style={{ transform: [{ rotate: "180deg" } ] }}/>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={$scrollViewContainer}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          // contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: undefined,
          }}
        >

          <View style={$categoriesWrapper}>
            {processedTransactions.length > 0 ? processedTransactions.map((item, index) => (
                <EnhancedCategoryCard
                  key={item.categoryId}
                  categoryId={item.categoryId}
                  category={item.category}
                  transactions={item.transactions}
                  totalExpenses={totalMonthlyExpenses || 0}
                  totalExpensesPerCategory={item.totalExpensesPerCategory || 0}
                  animationDelay={index * 50}
                  presentConfirmationModal={actions.openConfirmationSheet}
                />
            )) : null}
            <TouchableOpacity
              style={$addCategoryButtonContainer}
              onPress={() => actions.openAddCategorySheet('new')}
            >
              <Icon icon={"add"} size={typography.iconSize} color={colors.text} />
              <Text tx={"homeScreen.addCategory"} style={$addNewCategoryText}/>
            </TouchableOpacity>
          </View>

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
    transactions: database.get<TransactionModel>("transactions").query(
      Q.where('type', 'expense'),
      Q.where('transaction_at', Q.gte(new Date(startDate).getTime())),
      Q.where('transaction_at', Q.lte(new Date(endDate).getTime())),
    ).observe(),
    categories: database.get<CategoryModel>("categories").query().observe(),
  }
})

const EnhancedHomeScreen = enhance(HomeScreen)
export default EnhancedHomeScreen

const $screenContainer: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1
}

const $topContainer: ViewStyle = {
  justifyContent: "flex-start",
  paddingHorizontal: spacing.sm,
  paddingTop: spacing.md,
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
  paddingHorizontal: spacing.md,
  // marginTop: spacing.md,
}

const $goToTransactions: TextStyle = {
  marginBottom: spacing.lg,
}

const $goToTransactionsContainer: ViewStyle = {
  width: '100%',
  alignItems: "flex-end",
  paddingHorizontal: spacing.xxs,
}

const $goToTransactionsBtn: ViewStyle = {
  flexDirection: "row",
  gap: spacing.xs,
}

const $categoriesWrapper: ViewStyle = {
  backgroundColor: colors.elevatedBackground,
  borderRadius: spacing.xs,
  marginBottom: spacing.xl,
}

const $addCategoryButtonContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: spacing.xs,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.lg,
}

const $addNewCategoryText: TextStyle = {
  fontFamily: typography.primary.semiBold,
  color: colors.text
}