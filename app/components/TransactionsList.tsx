import React from "react"
import { withObservables } from "@nozbe/watermelondb/react"
import database from "../../db"
import { ListView } from "app/components/ListView"
import TransactionModel from "../../db/models/TransactionModel"
import { ListItem } from "app/components/ListItem"

type props = TransactionModel[]


const TransactionsList = ({ transactions }: { transactions : props }) => {
  return (
    <ListView
      estimatedItemSize={50}
      data={transactions}
      renderItem={({ item }) => (
        <ListItem text={item.description} />
      )}
    />
  )
}


const enhance = withObservables([], () => ({
  transactions: database.get('transactions').query(),
}))

const EnhancedTransactionsList = enhance(TransactionsList)

export default EnhancedTransactionsList
