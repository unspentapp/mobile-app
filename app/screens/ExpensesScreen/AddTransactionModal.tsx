import React, { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { BottomSheetBackground } from "app/components/BottomSheetBackground"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { BackHandler, Text, TextInput, useWindowDimensions, View, ViewStyle } from "react-native"
import { SceneMap, TabView } from "react-native-tab-view"
import { AllTransactionsScreen } from "app/screens/AllTransactionsScreen"
import { ErrorBoundary, HomeScreen } from "app/screens"
import { colors, spacing } from "app/theme"
import AnimatedDots from "app/components/AnimatedTabIndicator"
import AnimatedTabIndicator from "app/components/AnimatedTabIndicator"
import AddExpenseView from "app/screens/ExpensesScreen/AddExpenseView"
import { AddExpenseProps } from "app/screens/ExpensesScreen/AddExpenseView"
import { CalendarModal } from "app/screens/ExpensesScreen/CalendarModal"
import format from "date-fns/format"
import { useFocusEffect } from "@react-navigation/native"
import { TransactionDataI, useWmStorage } from "../../../db/useWmStorage"
import { getCategories } from "assets/data"
import database from "../../../db"
import Toast from "react-native-toast-message"

type Props = {
  bottomSheetModalRef: RefObject<BottomSheetModalMethods>,
  handleSheetChanges: (index: number) => void,
  expenseValue: string,
  setExpenseValue: Dispatch<SetStateAction<string>>,
  setNote: Dispatch<SetStateAction<string>>,
  date: string,
  setDate: Dispatch<SetStateAction<string>>
  setDateModalToggle: Dispatch<SetStateAction<boolean>>,
  selectedCategory: string,
  setSelectedCategory: Dispatch<SetStateAction<string>>,
  handleAddExpense: () => void,
  handleAddIncome: () => void,
}

const AddTransactionModal = ({
                               bottomSheetModalRef,
                               handleSheetChanges,
                             } : Props) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [expenseValue, setExpenseValue] = useState("")
  const [note, setNote] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [dateModalToggle, setDateModalToggle] = useState(false)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const { saveTransaction } = useWmStorage()

  const handleAddExpense = useCallback(async () => {
    const userId = await database.localStorage.get("USER_ID")

    if (!userId || !note.trim() || !expenseValue.trim()) {
      return
    }

    const newTransaction: TransactionDataI = {
      userId: userId as string,
      description: note.trim(),
      amount: parseFloat(expenseValue),
      categoryId: selectedCategory,
      type: "expense",
      transactionAt: new Date(date),
      isRecurring: false,
    }

    try {
      await saveTransaction(newTransaction)
      Toast.show({
        type: "success",
        text1: "Transaction Added",
        text2: "Your transaction has been added successfully.",
      })
      resetForm()
    } catch (error) {
      // TODO: Add error handling
      console.error('Failed to save transaction:', error)
    }
  }, [note, expenseValue, selectedCategory, date, saveTransaction])

  const resetForm = useCallback(() => {
    bottomSheetModalRef.current?.close()
    setDate(format(new Date(), 'yyyy-MM-dd'))
    setSelectedCategory("")
    setExpenseValue("")
    setNote("")
  }, [])

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        bottomSheetModalRef.current?.close()
        setDateModalToggle(false)
        return true
      }

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => subscription.remove()
    }, [dateModalToggle, bottomSheetModalRef]))

  const routes = [
    {
      key: 'first',
      title: 'First',
    },
    { key: 'second', title: 'Second' },
  ];

  /*const renderScene = SceneMap({
    first: AddExpenseView,
    second: SecondRoute,
  });*/

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return (
          <AddExpenseView
            expenseValue={expenseValue}
            setExpenseValue={setExpenseValue}
            handleAddExpense={handleAddExpense}
            date={date}
            setDate={setDate}
            setDateModalToggle={setDateModalToggle}
            setNote={setNote}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />)
      case 'second':
        return <View></View>;
      default:
        return null;
    }
  }

  return (

    <View>
      <CalendarModal
        visible={dateModalToggle}
        onClose={() => setDateModalToggle(false)}
        date={date}
        setDate={setDate}
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["100%"]}
        animateOnMount={true}
        backgroundComponent={(props) => <BottomSheetBackground {...props} />}
        onChange={handleSheetChanges}
        handleIndicatorStyle={$modalIndicator}
        // handleIndicatorStyle={{ display: 'none' }}
        // keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize"
        keyboardBehavior='interactive' // test
        keyboardBlurBehavior='restore' // test
        enableContentPanningGesture={false}
        enablePanDownToClose={true}
        enableDynamicSizing={true}
        /*handleComponent={
          () => (
            <AnimatedTabIndicator
              index={index}
              setIndex={setIndex}
            />
          )
        }*/
      >
        <BottomSheetView style={$container}>
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
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}

export default AddTransactionModal

const $container: ViewStyle = {
  flex: 1
};

const $modalIndicator: ViewStyle = {
  backgroundColor: colors.palette.primary500,
}

