import React, { FC, useState } from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { Text, Icon } from "app/components"
import { spacing } from "app/theme"
import EnhancedTransactionsList from "app/screens/AllTransactionsScreen/TransactionsList"
import { goBack, NavigationProps } from "app/navigators"
import { StatusBar } from "expo-status-bar"
import { useSafeAreaInsets } from "react-native-safe-area-context"


interface AllTransactionsScreenProps extends NavigationProps {}

export const AllTransactionsScreen: FC<AllTransactionsScreenProps> = () => {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const { top } = useSafeAreaInsets()

  return (
    <View style={$screenContainer}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={[$container, { paddingTop: top }]}>
        <View style={$topContainer}>
          <TouchableOpacity
            style={$goBackButton}
            onPress={goBack}
          >
            <Icon icon={"back"} />
          </TouchableOpacity>
          <Text testID="transactions-heading" tx={"allTransactionsScreen.title"} preset="heading" />
        </View>

        <View style={$listContainer}>
          <EnhancedTransactionsList
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        </View>
      </View>
    </View>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
}

const $topContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
  justifyContent: "flex-start",
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.sm,
}

const $goBackButton: ViewStyle = {
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xs,
}

const $listContainer: ViewStyle = {
  flex: 1,
}


