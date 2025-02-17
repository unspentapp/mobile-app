import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";
import { TableName } from "../schema"

export default class AuthSessionModel extends Model {
  static table = TableName.AUTH

  @text("session") session: string | undefined
}
