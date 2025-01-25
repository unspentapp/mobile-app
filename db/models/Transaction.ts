import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";

class Transaction extends Model {
  static table = 'transactions'

  @field('id') id
  @field('user_id') userId
  @relation('categories', 'category_id') category
  @field('category_id') categoryId
  @field('amount') amount
  @field('date') date
  @field('description') description
  @field('recurring') recurring
  @field('receipt_url') receiptUrl
  @field('updated_at') updatedAt
}