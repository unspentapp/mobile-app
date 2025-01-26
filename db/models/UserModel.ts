import { Model } from "@nozbe/watermelondb";
import { field, date, text, children, json } from "@nozbe/watermelondb/decorators"

// todo
export default class UserModel extends Model {
  static table = 'users'
  static associations = {
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