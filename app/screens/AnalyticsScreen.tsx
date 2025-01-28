import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Text, Screen, ListView, ListItem } from "app/components"
import { colors, spacing } from "app/theme"
import { useHeader } from "app/utils/useHeader"
import { MainTabScreenProps } from "app/navigators/MainNavigator"
import database from "../../db"
import TransactionModel from "../../db/models/TransactionModel"
import { log } from "app/utils/logger"
import { withObservables } from "@nozbe/watermelondb/react"
import TransactionsList from "app/components/TransactionsList"
import EnhancedTransactionsList from "app/components/TransactionsList"


interface AnalyticsScreenProps extends MainTabScreenProps<"Analytics"> {}

export const AnalyticsScreen: FC<AnalyticsScreenProps> = (
  _props,
) => {
  const { navigation } = _props
  // const logout = useStore((state) => state.logout)

  /* COMMON */
  function goSettings() {
    navigation.navigate("Settings")
  }

  useHeader({
      leftIcon: "menu",
      rightIcon: "settings",
      onRightPress: goSettings,
  }, [])

/*  const [trx, setTrx] = useState<TransactionModel[]>([])

  useEffect(() => {
    const fetchTrx = async () => {
      const trx = await database.get('transactions').query().fetch();
      log.info(trx);
      setTrx(trx)
    }

    fetchTrx()
  }, [])*/


  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <View style={$topContainer}>
        <Text testID="analytics-heading" tx={"analyticsScreen.title"} preset="heading" />
      </View>

      <EnhancedTransactionsList />
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


