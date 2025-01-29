import React, { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Text, Screen, ListView, ListItem } from "app/components"
import { colors, spacing } from "app/theme"
import { useHeader } from "app/utils/useHeader"
import EnhancedTransactionsList from "app/components/TransactionsList"
import { goBack, NavigationProps } from "app/navigators"


interface AllTransactionsScreenProps extends NavigationProps {}

export const AllTransactionsScreen: FC<AllTransactionsScreenProps> = () => {

  useHeader({
      leftIcon: "back",
      // rightIcon: "settings",
      onLeftPress: goBack,

  }, [])


  return (
    <Screen preset="scroll" contentContainerStyle={$container}>
      <View style={$topContainer}>
        <Text testID="transactions-heading" tx={"allTransactionsScreen.title"} preset="heading" />
      </View>

      <View style={$listContainer}>
        <EnhancedTransactionsList />
      </View>
    </Screen>
  )
}


const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  justifyContent: "flex-start",
  paddingHorizontal: spacing.lg,
}

const $listContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.lg,
}


