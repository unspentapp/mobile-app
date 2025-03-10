import { Model } from "@nozbe/watermelondb";
import { children, date, field, readonly } from "@nozbe/watermelondb/decorators"
import TransactionModel from "./TransactionModel"
import { Associations } from "@nozbe/watermelondb/Model"
import { TableName } from "../schema"
import { colors } from "app/theme"


// todo
export default class CategoryModel extends Model {
  static table = TableName.CATEGORIES
  static associations : Associations = {
    transactions: { type: "has_many", foreignKey: "category_id" },
  }

  @children("transactions") transactions: TransactionModel[] | undefined

  @field("user_id") userId?: string
  @field("name") name!: string
  @field("type") type!: "expense" | "income"
  @field("is_default") isDefault!: boolean
  @field("icon") icon?: string
  @field("color") color!: keyof typeof colors.custom
  // @field('budget') budget?: number
  @readonly @date("updated_at") updatedAt?: number
  @readonly @date("createdAt") createdAt?: number
}