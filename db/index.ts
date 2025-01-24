import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./schema";
import migrations from "./migrations";
import AuthSession from "./models/AuthSession";

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: false,
  onSetUpError: (error) => {
    // Database failed to load -- offer the user to reload the app or log out
    console.log("DATABASE SETUP ERROR", error);
  },
});

const database = new Database({
  adapter,
  modelClasses: [AuthSession],
});

export default database;
