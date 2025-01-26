import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";

export default class AuthSessionModel extends Model {
  static table = "auth_session"

  @text("session") session: string | undefined
}
