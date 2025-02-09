import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./schema";
import migrations from "./migrations";
import AuthSessionModel from "./models/AuthSessionModel";
import TransactionModel from "./models/TransactionModel"
import CategoryModel from "./models/CategoryModel"

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
  modelClasses: [AuthSessionModel, TransactionModel, CategoryModel],
});

export default database;
