import { Model } from "@nozbe/watermelondb";
import { children, date, field, readonly } from "@nozbe/watermelondb/decorators"

// todo
export default class CategoryModel extends Model {
  static table = 'categories'
  static associations = {
    transactions: {type: "has_many", foreignKey: "category_id"},
  }

  @children("transactions") transactions

  @field('user_id') userId?: string
  @field('name') name!: string
  @field('type') type!: "expense" | "income"
  @field('is_default') isDefault!: boolean
  @field('icon') icon?: string
  @field('color') color?: string
  // @field('budget') budget?: number
  @readonly @date('updated_at') updatedAt?: number
  @readonly @date('createdAt') createdAt?: number
}