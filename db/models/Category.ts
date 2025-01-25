import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";

class Category extends Model {
  static table = 'categories'

  @field('id') id
  @field('user_id') userId
  @field('name') name
  @field('type') type
  @field('is_default') isDefault
  @field('icon') icon
  @field('color') color
  @field('updated_at') updatedAt
}
