import React from "react"
import { withObservables } from "@nozbe/watermelondb/react"
import database from "../../db"
import { ListView } from "app/components/ListView"
import TransactionModel from "../../db/models/TransactionModel"
import { ListItem } from "app/components/ListItem"
import RowItem from "app/components/RowItem"
import { Q } from "@nozbe/watermelondb"
import { ViewStyle } from "react-native"
import { spacing } from "app/theme"

type props = TransactionModel[]


const TransactionsList = ({ transactions }: { transactions : props }) => {
  return (
    <ListView
      estimatedItemSize={50}
      data={transactions}
      renderItem={({ item }) => (
        <RowItem data={item} />
      )}
    />
  )
}


const enhance = withObservables([], () => ({
  transactions: database.get('transactions').query(
    Q.sortBy("created_at", Q.desc)
  ),
}))

const EnhancedTransactionsList = enhance(TransactionsList)

export default EnhancedTransactionsList
