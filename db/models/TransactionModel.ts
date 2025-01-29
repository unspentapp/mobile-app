import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators"


// todo add all the fields needed
export default class TransactionModel extends Model {
  static table = 'transactions'

  @field('user_id') userId!: string
  @field('amount') amount!: number
  @field('category_id') categoryId?: string
  @field('description') description!: string
  @field('date') date!: string
  @field('type') type!: "expense" | "income"
 // @field('is_recurring') isRecurring!: boolean
//   @field('receipt_url') receiptUrl?: string
  @readonly @date('updated_at') updatedAt?: number
  @readonly @date('createdAt') createdAt?: number

}