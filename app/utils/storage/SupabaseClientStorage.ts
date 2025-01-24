import { Database } from "@nozbe/watermelondb";
import database from "../../../db"
import AuthSession from "../../../db/models/AuthSession"
import * as Crypto from 'expo-crypto';
import * as SecureStore from "expo-secure-store";
import aesjs from 'aes-js';
import { logger as wmLog } from "@nozbe/watermelondb/utils/common"

/**
 * AnyFunction, MaybePromisify, SupportedStorage type taken from node_modules/@supabase/auth-js/src/lib/types.ts for reference
 */

/**
 * AnyFunction represents any function type in JavaScript that can handle various argument types and return values.
 * It's a flexible type definition crucial for handling different operations within our application.
 */
type AnyFunction = (...args: any[]) => any;

/**
 * MaybePromisify<T> is a utility type that allows a value of type T or a Promise resolving to type T.
 * This is particularly useful when we want to handle asynchronous operations in a consistent manner.
 */
type MaybePromisify<T> = T | Promise<T>;

/**
 * PromisifyMethods<T> transforms methods within an object T to be asynchronous if they're functions.
 * This ensures uniformity in how our methods interact with data, especially when dealing with asynchronous operations like fetching or updating data.
 */
type PromisifyMethods<T> = {
  [K in keyof T]: T[K] extends AnyFunction
    ? (...args: Parameters<T[K]>) => MaybePromisify<ReturnType<T[K]>>
    : T[K];
};

type SupportedStorageTypes = PromisifyMethods<
  Pick<Storage, "getItem" | "setItem" | "removeItem">
> & {
  isServer?: boolean;
};

class SupabaseClientStorage implements SupportedStorageTypes {
  private static instance: SupabaseClientStorage | null = null; // Singleton instance of SupabaseClientStorage class
  private db: Database; // Instance of WatermelonDB
  public isServer?: boolean; // Flag indicating server-side environment (optional)

  private constructor() {
    this.db = database;
    this.isServer = false;
  }

  // Singleton pattern to ensure only one instance exists
  public static getInstance(): SupabaseClientStorage {
    if (!SupabaseClientStorage.instance) {
      SupabaseClientStorage.instance = new SupabaseClientStorage();
    }
    return SupabaseClientStorage.instance;
  }

  private readonly MASTER_KEY_ALIAS = 'auth_master_key';

  /*async setItem(key: string, value: string): Promise<void> {
    await this.db.write(async () => {
      await this.db
        .get<AuthSession>("auth_session")
        .create((record) => {
          record._raw.id = key; // set key as row id this will help in get and remove item with passed key argument by supabase
          record.session = value; // set value to session field
          console.log("[SET ROW] " + " key:" + key + " value: " + value)
        })
        .catch((error) => {
          wmLog.log(`Error saving auth session (key: ${key}) from storage: `, error);
        });
    });
  }

  getItem(key: string): MaybePromisify<string | null> {
    // from auth_session table find collection for passed key
    return this.db
      .get<AuthSession>("auth_session")
      .find(key)
      .then((result) => {
        // just return value of session
        wmLog.log("[GET ROW] " + key + " " + result.session)
        return result?.session || null
      })
      .catch((error) => {
        wmLog.log(`Error retrieving auth session (key: ${key}) from storage: `, error);
      });
  }

  async removeItem(key: string): Promise<void> {
    try {
      // find a collection with key
      const session = await this.db.get<AuthSession>("auth_session").find(key);
      if (session) {
        await this.db.write(async () => {
          // delete that collection if exist
          await session.destroyPermanently();
        });
      }
    } catch (error) {
      wmLog.error(`Error removing auth session (key: ${key}) from storage: `, error);
    }
  }*/

  /*private async _encrypt(key: string, value: string) {
    // 128-bit key
    const encryptionKey = Crypto.getRandomValues(new Uint8Array(16));

    // convert the value to bytes (UTF-8 to Uint8Array.)
    const valueBytes = aesjs.utils.utf8.toBytes(value);
    // counter CTR
    const aesCtr = new aesjs.ModeOfOperation.ctr(encryptionKey);

    // converting encryption key to hex string and storing in secure store
    await SecureStore.setItemAsync(
      key,
      aesjs.utils.hex.fromBytes(encryptionKey)
    );

    // encrypt the value bytes
    const encryptedBytes = aesCtr.encrypt(valueBytes);
    // convert encrypted bytes to hex string
    const encryptedValue = aesjs.utils.hex.fromBytes(encryptedBytes);

    return encryptedValue;
  }

  private async _decrypt(key: string, value: string) {
    // retrive hex key from secure store
    const encryptionKey = await SecureStore.getItemAsync(key);
    if (!encryptionKey) {
      return null;
    }
    const encryptedKeyInBytes = aesjs.utils.hex.toBytes(encryptionKey);
    // counter CTR
    const aesCtr = new aesjs.ModeOfOperation.ctr(encryptedKeyInBytes);
    const decryptedBytes = aesCtr.decrypt(aesjs.utils.hex.toBytes(value));

    // Convert our bytes back into text
    const decryptedValue = aesjs.utils.utf8.fromBytes(decryptedBytes)
    return decryptedValue
  }*/

    async getItem(key: string): Promise<string | null> {
    try {
      // First check if the record exists
      const collection = this.db.get<AuthSession>("auth_session");
      const records = await collection.query().fetch();
      const record = records.find(r => r.id === key);

      if (!record || !record.session) {
        wmLog.log(`No record found for key: ${key}`);
        return null;
      }

      const decryptedValue = await this._decrypt(record.session);
      wmLog.log(`Record found for key: ${key} >> ${record.session}`);
      return decryptedValue;
    } catch (error) {
      wmLog.error(`Error retrieving session (key: ${key}):`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const encryptedValue = await this._encrypt(value);

      await this.db.write(async () => {
        const collection = this.db.get<AuthSession>("auth_session");
        const records = await collection.query().fetch();
        const existingRecord = records.find(r => r.id === key);

        if (existingRecord) {
          wmLog.log(`Updating existing record for key: ${key}`);
          await existingRecord.update(record => {
            record.session = encryptedValue;
            wmLog.log(`Record found for key: ${key} >> ${encryptedValue}`);
          });
        } else {
          wmLog.log(`Creating new record for key: ${key}`);
          await collection.create(record => {
            record._raw.id = key;
            record.session = encryptedValue;
            wmLog.log(`Record created for key: ${key} >> ${encryptedValue}`);
          });
        }
      });

      // Verify the record was created/updated
      const verifyRecord = await this.db.get<AuthSession>("auth_session")
        .query()
        .fetch()
        .then(records => records.find(r => r.id === key));

      if (!verifyRecord) {
        throw new Error(`Failed to verify record creation for key: ${key}`);
      }

    } catch (error) {
      wmLog.error(`Error saving session (key: ${key}):`, error);
      // Log more details about the error
      if (error instanceof Error) {
        wmLog.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const collection = this.db.get<AuthSession>("auth_session");
      const records = await collection.query().fetch();
      const record = records.find(r => r.id === key);

      if (record) {
        await this.db.write(async () => {
          wmLog.log(`Deleting record for key: ${key}`)
          await record.destroyPermanently();
        });
      }
    } catch (error) {
      wmLog.error(`Error removing session (key: ${key}):`, error);
      throw error;
    }
  }

  private async getMasterKey(): Promise<Uint8Array> {
    try {
      const storedKey = await SecureStore.getItemAsync(this.MASTER_KEY_ALIAS);

      if (storedKey) {
        // We have an existing key
        return aesjs.utils.hex.toBytes(storedKey);
      }

      // Create a new key
      const newKey = Crypto.getRandomValues(new Uint8Array(16));
      const newKeyHex = aesjs.utils.hex.fromBytes(newKey);
      await SecureStore.setItemAsync(this.MASTER_KEY_ALIAS, newKeyHex);
      return newKey;
    } catch (error) {
      console.error('Error getting master key:', error);
      throw error;
    }
  }

  private async _encrypt(value: string): Promise<string> {
    try {
      const masterKey = await this.getMasterKey();
      const iv = Crypto.getRandomValues(new Uint8Array(16));
      const valueBytes = aesjs.utils.utf8.toBytes(value);
      const aesCtr = new aesjs.ModeOfOperation.ctr(masterKey, new aesjs.Counter(iv));
      const encryptedBytes = aesCtr.encrypt(valueBytes);

      const combined = new Uint8Array(iv.length + encryptedBytes.length);
      combined.set(iv);
      combined.set(encryptedBytes, iv.length);

      return aesjs.utils.hex.fromBytes(combined);
    } catch (error) {
      wmLog.error('Error encrypting value:', error);
      throw error;
    }
  }

  private async _decrypt(encryptedValue: string): Promise<string> {
    try {
      const masterKey = await this.getMasterKey();
      const combined = aesjs.utils.hex.toBytes(encryptedValue);
      const iv = combined.slice(0, 16);
      const encryptedBytes = combined.slice(16);

      const aesCtr = new aesjs.ModeOfOperation.ctr(masterKey, new aesjs.Counter(iv));
      const decryptedBytes = aesCtr.decrypt(encryptedBytes);

      return aesjs.utils.utf8.fromBytes(decryptedBytes);
    } catch (error) {
      wmLog.error('Error decrypting value:', error);
      throw error;
    }
  }
}

const clientAuthStorageInstance = SupabaseClientStorage.getInstance();



export default clientAuthStorageInstance;
