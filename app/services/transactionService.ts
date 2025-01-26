import { Q } from '@nozbe/watermelondb'
import { addMonths, startOfMonth, endOfMonth } from 'date-fns'
import database from "../../db"
import { log } from "../utils/logger"

export interface Transaction {
    id: string;
    user_id: string;
    category_id?: string;
    type: 'expense' | 'income';
    amount: number;
    date: Date;
    description?: string;
    recurring?: boolean;
    receipt_url?: string;
    created_at: Date;
    updated_at: Date;
}

export const saveTransaction = async (transaction: Transaction) => {
  try {
    await database.write(async () => {
      await database.get('transactions').create(data => {
        data.id = transaction.id
        data.userId = transaction.user_id
        data.categoryId = transaction.category_id
        data.type = transaction.type
        data.amount = transaction.amount
        data.date = transaction.date.getTime() // Convert to timestamp
        data.description = transaction.description
        data.recurring = transaction.recurring
        data.receiptUrl = transaction.receipt_url
        data.createdAt = transaction.created_at.getTime()
        data.updatedAt = transaction.updated_at.getTime()
      })
    })
  } catch (error) {
    log.error('Failed to save transaction', error)
  }
}

/*
export const getCurrentMonthTransactions = async () => {
    const now = new Date()
    const start = startOfMonth(now)
    const end = endOfMonth(now)

    return await database.get('transactions')
      .query(
        Q.where('date', Q.between(start.getTime(), end.getTime())),
        Q.sortBy('date', Q.desc)
      )
      .fetch()
}

  // Fetch transactions grouped by month (for transaction list screen)
  async getTransactionsByMonth(lookbackMonths = 12) {
    const monthlyTransactions = []

    for (let i = 0; i < lookbackMonths; i++) {
      const currentDate = new Date()
      const targetMonth = addMonths(currentDate, -i)

      const start = startOfMonth(targetMonth)
      const end = endOfMonth(targetMonth)

      const monthTransactions = await database.get('transactions')
        .query(
          Q.where('date', Q.between(start.getTime(), end.getTime())),
          Q.sortBy('date', Q.desc)
        )
        .fetch()

      if (monthTransactions.length > 0) {
        monthlyTransactions.push({
          month: targetMonth,
          transactions: monthTransactions
        })
      }
    }

    return monthlyTransactions
  }

  // Sync transactions from Supabase
  async syncTransactions(userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (data) {
      await database.write(async () => {
        await database.get('transactions').create(data)
      })
    }
  }
}

// Usage in React components
function HomeScreen() {
  const [transactions, setTransactions] = useState([])
  const transactionService = new TransactionService()

  useEffect(() => {
    const loadTransactions = async () => {
      const currentMonthTransactions = await transactionService.getCurrentMonthTransactions()
      setTransactions(currentMonthTransactions)
    }
    loadTransactions()
  }, [])
}

function TransactionListScreen() {
  const [monthlyTransactions, setMonthlyTransactions] = useState([])
  const transactionService = new TransactionService()

  useEffect(() => {
    const loadTransactions = async () => {
      const transactions = await transactionService.getTransactionsByMonth()
      setMonthlyTransactions(transactions)
    }
    loadTransactions()
  }, [])
} */
