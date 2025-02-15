import React, { FC, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Text, Screen } from "app/components"
import { spacing } from "app/theme"
import { useHeader } from "app/utils/useHeader"
import EnhancedTransactionsList from "app/screens/AllTransactionsScreen/TransactionsList"
import { goBack, NavigationProps } from "app/navigators"


interface AllTransactionsScreenProps extends NavigationProps {}

export const AllTransactionsScreen: FC<AllTransactionsScreenProps> = () => {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  useHeader({
      leftIcon: "back",
      onLeftPress: goBack,
  }, [])


  return (
    <Screen preset="fixed" contentContainerStyle={$container}>
      <View style={$topContainer}>
        <Text testID="transactions-heading" tx={"allTransactionsScreen.title"} preset="heading" />
      </View>

      <View style={$listContainer}>
        <EnhancedTransactionsList
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
}

const $topContainer: ViewStyle = {
  justifyContent: "flex-start",
  paddingHorizontal: spacing.lg,
}

const $listContainer: ViewStyle = {
  flex: 1,
  paddingVertical: spacing.md,
}


