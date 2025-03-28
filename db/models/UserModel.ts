import { Model } from "@nozbe/watermelondb";
import { field, date, text, children } from "@nozbe/watermelondb/decorators"
import { Associations } from "@nozbe/watermelondb/Model"
import { TableName } from "../schema"
import TransactionModel from "./TransactionModel"

// todo
export default class UserModel extends Model {
  static table = TableName.USERS
  static associations : Associations = {
    transactions: { type: "has_many", foreignKey: "user_id" },
  }

  @field('username') username!: string
  @text('email') email!: string
  @text('avatar_url') avatarUrl?: string
  @field('preferences') preferences!: string
  @children('transactions') transactions?: TransactionModel[]
  @date('createdAt') created_at?: number
  @date('updated_at') updatedAt?: number



  updateProfile = async (newData: Partial<UserModel>) => {
    return this.update(user => {
      if (newData.username) user.username = newData.username;
      if (newData.avatarUrl) user.avatarUrl = newData.avatarUrl;
      if (newData.email) user.email = newData.email;

    });
  }

  get parsedPreferences() {
    try {
      return JSON.parse(this.preferences || '{}');
    } catch (error) {
      console.error("Error parsing preferences:", error);
      return {};
    }
  }

  updatePreferences = async (newPreferences) => {
    const currentPreferences = this.parsedPreferences;
    const updatedPreferences = { ...currentPreferences, ...newPreferences };

    return this.update(user => {
      user.preferences = JSON.stringify(updatedPreferences);
    });
  }
}