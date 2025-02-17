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

  @relation("categories", "category_id") category: CategoryModel | undefined

  @field("user_id") userId?: string
  @field("amount") amount!: number
  @field("category_id") categoryId?: string
  @field("description") description!: string
  @date("transaction_at") transactionAt!: Date
  @field("type") type!: "expense" | "income"
  @field("is_recurring") isRecurring?: boolean
  //   @field('receipt_url') receiptUrl?: string
  @readonly @date("updated_at") updatedAt?: number
  @readonly @date("createdAt") createdAt?: number


  /**
   * Update transaction and optionally its category in a batch operation
   * @param transactionData Data to update for the transaction
   * @param categoryData Optional data to update for the category
   * @returns Promise that resolves when the batch operation completes
   */
  @writer async updateWithCategory(
    transactionData: Partial<TransactionModel>,
    // categoryData: Partial<CategoryModel>
  ): Promise<void> {
    console.log(transactionData)
  await this.batch(
    this.prepareUpdate(tx => {
      if (transactionData.amount !== undefined) tx.amount = transactionData.amount
      if (transactionData.description !== undefined) tx.description = transactionData.description
      if (transactionData.transactionAt !== undefined) tx.transactionAt = transactionData.transactionAt
      if (transactionData.type !== undefined) tx.type = transactionData.type
      if (transactionData.isRecurring !== undefined) tx.isRecurring = transactionData.isRecurring
      if (transactionData.categoryId !== undefined) tx.categoryId = transactionData.categoryId
    }),
  )}
}