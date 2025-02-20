import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ScrollView, TextInput, TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Icon, Text } from "app/components"
import { colors, spacing, typography } from "app/theme"
import { MainTabScreenProps } from "app/navigators/MainNavigator"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import AddTransactionModal from "app/screens/Transactions/AddTransactionModal"
import EnhancedCategoryCard from "app/screens/HomeScreen/CategoryCard"
import { withObservables } from "@nozbe/watermelondb/react"
import database from "../../../db"
import { Q } from "@nozbe/watermelondb"
import { endOfMonth, startOfMonth } from "date-fns"
import AddCategoryModal from "app/screens/HomeScreen/AddCategoryModal"
import { StatusBar } from "expo-status-bar"
import MonthReviewCard from "app/screens/HomeScreen/MonthReviewCard"
import { useFocusEffect } from "@react-navigation/native"
import { ConfirmationSheet } from "app/components/ConfirmationSheet"
import CategoryModel from "../../../db/models/CategoryModel"
import { useModals } from "app/hooks/useModals"
import TransactionModel from "../../../db/models/TransactionModel"
import AnimatedBackground from "app/components/AnimatedBackground"




const ROUND_BUTTON_SIZE = 56

interface ExpensesScreenProps extends MainTabScreenProps<"ExpensesNavigator"> {
  transactions: TransactionModel[]
  categories: CategoryModel[]
}

type BottomSheetTextInputRef = TextInput


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
  const [groupedTransactions, setGroupedTransactions] = useState<Map<string, TransactionModel[]>>(new Map())
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)

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

      setGroupedTransactions(grouped)
    }, [transactions, categories])
  )

/*
  const handlePresentConfirmationSheet = useCallback((category: Partial<CategoryModel>) => {
    setEditableCategory(category)
    setIsConfirmationVisible(true)
    confirmationSheetRef?.current?.present()
  }, [])

  const handleEditCategorySheet = useCallback(() => {
    setModalType('edit')
    setIsConfirmationVisible(false)
    addCategorySheetRef.current?.present()
  }, [])

  const handleDismissConfirmationSheet = useCallback(() => {
    setIsConfirmationVisible(false)
    confirmationSheetRef.current?.dismiss()
    setEditableCategory(null)
  }, [])

  const handleDismissAddCategorySheet = useCallback(() => {
    addCategorySheetRef.current?.dismiss()
    setIsConfirmationVisible(false)
    confirmationSheetRef.current?.dismiss()
    setEditableCategory(null)
    setModalType('new')
  }, [])
*/


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
            tx.category = undefined
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



  return (
    <View style={$screenContainer}>
      <AnimatedBackground count={8} hue={"monochrome"} />
      <StatusBar backgroundColor="transparent" translucent={true} />

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
          onDismiss={actions.closeAddCategorySheet}
        />

        {modalState.category && (
          <ConfirmationSheet
            bottomSheetRef={refs.confirmationSheetRef}
            title={`Category: ${modalState.category.name}`}
            primaryButton={{
              text: "Edit",
              onPress: () => actions.openAddCategorySheet('edit', modalState.category),
              style: { backgroundColor: 'green' },
              textStyle: { color: 'white' },
            }}
            secondaryButton={{
              text: "Delete",
              onPress: handleDeleteCategory,
            }}
            onDismiss={actions.closeConfirmationSheet}
          />
        )}

        <View style={$topContainer}>
          <MonthReviewCard totalMonthlyExpenses={totalMonthlyExpenses} />
        </View>

        <ScrollView
          style={$scrollViewContainer}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
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
            const category = categoryId === 'unknown'
              ? { id: 'unknown', name: 'Uncategorized', color: colors.textDim, type: 'expense' }
              : categories.find(c => c.id === categoryId)

            if (!category) return null
            if (categoryId === 'unknown' && categoryTransactions.length === 0) return null

            return (
              <EnhancedCategoryCard
                key={categoryId}
                categoryId={categoryId}
                category={category}
                transactions={categoryTransactions}
                totalExpenses={totalMonthlyExpenses || 0}
                animationDelay={index * 50}
                presentConfirmationModal={actions.openConfirmationSheet}
              />
            )
          }) : null}

          <TouchableOpacity
            style={$addCategoryButtonContainer}
            onPress={() => actions.openAddCategorySheet('new')}
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
    ).observe(),
    categories: database.get("categories").query().observe(),
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
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xs
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













