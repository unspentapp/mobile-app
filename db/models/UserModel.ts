import { Model } from "@nozbe/watermelondb";
import { field, date, text, children } from "@nozbe/watermelondb/decorators"
import { Associations } from "@nozbe/watermelondb/Model"
import { TableName } from "../schema"

// todo
export default class UserModel extends Model {
  static table = TableName.USERS
  static associations : Associations = {
    transactions: { type: "has_many", foreignKey: "user_id" },
  }

  @field('username') username
  @text('email') email
  @text('avatar_url') avatarUrl
  @field('preferences') preferences
  @children('transactions') transactions
  @date('createdAt') created_at
  @date('updated_at') updatedAt
}