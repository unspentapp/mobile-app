import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, relation, writer } from "@nozbe/watermelondb/decorators"
import CategoryModel from "./CategoryModel"
import { Associations } from "@nozbe/watermelondb/Model"
import { TableName } from "../schema"


// todo add all the fields needed
export default class TransactionModel extends Model {
  static table = TableName.TRANSACTIONS
  static associations : Associations = {
    categories: { type: "belongs_to", key: "category_id" },
  }


  @field("user_id") userId?: string
  @field("amount") amount!: number
  @field("description") description!: string
  @field("category_id") categoryId!: string | null
  @relation("categories", "category_id") category: CategoryModel | undefined
  @date("transaction_at") transactionAt!: Date
  @field("type") type!: "expense" | "income"
  @field("is_recurring") isRecurring?: boolean
  @readonly @date("updated_at") updatedAt?: number
  @readonly @date("createdAt") createdAt?: number


/*  /!**
   * Update transaction and optionally its category in a batch operation
   * @param transactionData Data to update for the transaction
   * @param categoryData Optional data to update for the category
   * @returns Promise that resolves when the batch operation completes
   *!/
  @writer async updateWithCategory(
    transactionData: TransactionModel,
    categoryData: CategoryModel
  ): Promise<void> {
  await this.batch(
    this.prepareUpdate(tx => {
      if (transactionData.amount !== undefined) tx.amount = transactionData.amount
      if (transactionData.description !== undefined) tx.description = transactionData.description
      if (transactionData.transactionAt !== undefined) tx.transactionAt = transactionData.transactionAt
      if (transactionData.type !== undefined) tx.type = transactionData.type
      if (transactionData.isRecurring !== undefined) tx.isRecurring = transactionData.isRecurring
    }),
  )}

  @writer async updateDetails({ amount, description, categoryId }) {
    await this.update(transaction => {
      if (amount !== undefined) transaction.amount = amount
      if (description !== undefined) transaction.description = description
      if (categoryId !== undefined) transaction.category = categoryId
    })
  }*/


  @writer async addNewTransaction(transactionData, categoryId) {
    const category = await this.collections.get<CategoryModel>("categories").find(categoryId)

    const newTx = await this.collections.get<TransactionModel>("transactions").create(transaction => {
      transaction.amount = transactionData.amount
      transaction.description = transactionData.description
      transaction.transactionAt = transactionData.date || new Date()
      transaction.type = transactionData.type || (transactionData.amount < 0 ? 'expense' : 'income')
      transaction.categoryId = categoryId
      // transaction.userId = userId
    })

    return newTx;
  }

  /**
   * Save a transaction with a specific category ID in a batch operation
   * @param {Object} transactionData - Transaction data to save/update
   * @param {string} categoryId - ID of an existing category to associate
   */
  @writer async saveWithCategoryId(transactionData, categoryId) {
    await this.update(transaction => {
      if (transactionData.amount !== undefined) transaction.amount = transactionData.amount
      if (transactionData.description !== undefined) transaction.description = transactionData.description
      if (transactionData.transactionAt !== undefined) transaction.transactionAt = transactionData.transactionAt
      if (transactionData.type !== undefined) transaction.type = transactionData.type

      // Set the category relationship
      transaction.categoryId = categoryId
    })
  }

}