import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "auth_session",
      columns: [{ name: "session", type: "string" }],
    }),
    tableSchema({
        name: "categories",
        columns
    })
  ],
});



// Database Setup
const adapter = new SQLiteAdapter({
  schema: {
    categories: `
      id TEXT PRIMARY KEY,
      name TEXT,
      type TEXT,
      user_id TEXT,
      is_default INTEGER,
      icon TEXT,
      color TEXT
    `,
    transactions: `
      id TEXT PRIMARY KEY,
      amount REAL,
      date TEXT,
      description TEXT,
      category_id TEXT,
      FOREIGN KEY(category_id) REFERENCES categories(id)
    `
  }
})

const database = new Database({
  adapter,
  modelClasses: [Category, Transaction]
})

// Sync Function
async function syncWithSupabase(userId: string) {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      // Fetch categories
      const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .gt('updated_at', new Date(lastPulledAt || 0).toISOString())

      // Fetch transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gt('updated_at', new Date(lastPulledAt || 0).toISOString())

      return {
        changes: {
          categories,
          transactions
        },
        timestamp: new Date().toISOString()
      }
    },
    pushChanges: async ({ changes }) => {
      // Push local changes to Supabase
      if (changes.categories?.length) {
        await supabase.from('categories').upsert(changes.categories)
      }

      if (changes.transactions?.length) {
        await supabase.from('transactions').upsert(changes.transactions)
      }
    }
  })
}

// Hooks and Utilities
function useCategoryOperations(userId: string) {
  const createCategory = async (categoryData) => {
    const newCategory = await database.write(async () => {
      return await database.get('categories').create(category => {
        category.name = categoryData.name
        // Set other fields
      })
    })

    // Sync with Supabase
    await syncWithSupabase(userId)
    return newCategory
  }

  return { createCategory }
}

function useTransactionOperations(userId: string) {
  const addTransaction = async (transactionData) => {
    const newTransaction = await database.write(async () => {
      return await database.get('transactions').create(transaction => {
        transaction.amount = transactionData.amount
        // Set other fields
      })
    })

    // Sync with Supabase
    await syncWithSupabase(userId)
    return newTransaction
  }

  return { addTransaction }
}

export {
  database,
  syncWithSupabase,
  useCategoryOperations,
  useTransactionOperations
}