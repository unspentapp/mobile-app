import React, { RefObject, useCallback, useState } from "react"
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { BottomSheetBackground } from "app/components/BottomSheetBackground"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { BackHandler, useWindowDimensions, View, ViewStyle } from "react-native"
import { TabView } from "react-native-tab-view"
import { colors, spacing } from "app/theme"
import AnimatedTabIndicator from "app/components/AnimatedTabIndicator"
import AddTransactionView from "app/screens/Transactions/AddTransactionView"
import { useFocusEffect } from "@react-navigation/native"
import { TransactionData, useWmStorage } from "../../../db/useWmStorage"
import database from "../../../db"
import Toast from "react-native-toast-message"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import BottomSheetBackdrop from "app/components/BottomSheetBackdrop"

type Props = {
  bottomSheetModalRef: RefObject<BottomSheetModalMethods>,
  isOpen: boolean
  onDismiss: () => void
}

type RouteProps = {
  key: 'income' | 'expense',
  title: 'Expense' | 'Income',
}

const AddTransactionModal = ({ bottomSheetModalRef, isOpen, onDismiss }: Props) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const { addNewTransaction } = useWmStorage()

  const routes : RouteProps[] = [
    { key: 'expense', title: 'Expense' },
    { key: 'income', title: 'Income' },
  ];

  const handleAddTransaction = useCallback(async (
    expenseValue: string,
    note: string,
    selectedCategoryId: string,
    date: number,
    type: 'expense' | 'income'
  ) => {
    const userId = await database.localStorage.get("USER_ID")

    if (!userId || !note.trim() || !expenseValue.trim()) {
      return
    }

    const newTransaction: TransactionData = {
      userId: userId as string,
      description: note.trim(),
      amount: parseFloat(expenseValue),
      categoryId: selectedCategoryId,
      type,
      transactionAt: date,
      isRecurring: false,
    }

    try {
      await addNewTransaction(newTransaction)
    } catch (error) {
      console.error('Failed to save transaction:', error)
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Something went wrong. Try again.",
      })
    } finally {
      bottomSheetModalRef.current?.close()
    }
  }, [addNewTransaction, bottomSheetModalRef])

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        bottomSheetModalRef.current?.close()
        return true
      }

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => subscription.remove()
    }, [bottomSheetModalRef])
  )

  const renderScene = ({ route } : { route : RouteProps}) => {
    switch (route.key) {
      case 'expense':
        return (
          <AddTransactionView
            type="expense"
            onAddTransaction={handleAddTransaction}
            index={index}
            isModalOpen={isOpen}
          />)
      case 'income':
        return (
          <AddTransactionView
            type="income"
            onAddTransaction={handleAddTransaction}
            index={index}
            isModalOpen={isOpen}
          />
        );
      default:
        return null;
    }
  }

  const handleDismissModal = () => {
    setIndex(0)
    onDismiss()
  }

  const { top } = useSafeAreaInsets()

  return (
    <View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        topInset={top}
        snapPoints={["100%"]}
        animateOnMount={true}
        backgroundComponent={(props) => <BottomSheetBackground {...props} />}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} />}
        handleIndicatorStyle={$modalIndicator}
        keyboardBehavior="fillParent"
        android_keyboardInputMode="adjustResize"
        // keyboardBehavior='interactive' // test
        // keyboardBlurBehavior='restore' // test
        enableContentPanningGesture={true}
        enablePanDownToClose={true}
        enableDynamicSizing={true}
        activeOffsetY={50}
        onDismiss={handleDismissModal} // todo on dismiss reset form and tab index
      >
        <BottomSheetView style={$viewContainer}>

            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: layout.width }}
              renderTabBar={() =>
                <AnimatedTabIndicator
                  index={index}
                  setIndex={setIndex}
              />}
              lazy={true}
            />

        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}

export default AddTransactionModal


const $viewContainer: ViewStyle = {
  flex: 1,
};

const $modalIndicator: ViewStyle = {
  marginTop: spacing.sm,
  backgroundColor: colors.palette.primary500,
}

