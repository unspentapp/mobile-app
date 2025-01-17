import { Database } from "@nozbe/watermelondb";
import database from "../../../db"
import AuthSession from "../../../db/models/AuthSession"
import * as Crypto from 'expo-crypto';
import SecureStore from "expo-secure-store";
import aesjs from 'aes-js';

/**
 * AnyFunction, MaybePromisify, SupportedStorage type taken from node_modules/@supabase/auth-js/src/lib/types.ts for reference
 */

type AnyFunction = (...args: any[]) => any;
type MaybePromisify<T> = T | Promise<T>;

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
  private db: Database; // Instance of your chosen database (e.g., WatermelonDB)
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

  /*getItem(key: string): MaybePromisify<string | null> {
    return this.db
      .get<AuthSession>("auth_session")
      .find(key)
      .then(async (result) => {
        const decryptedValue = await this._decrypt(key, result.session);
        return decryptedValue;
      })
      .catch(() => null);
  }*/

  /*async setItem(key: string, value: string): Promise<void> {
    const encryptedValue = await this._encrypt(key, value);
    await this.db.write(async () => {
      await this.db
        .get<AuthSession>("auth_session")
        .create((record) => {
          record._raw.id = key;
          record.session = encryptedValue;
        })
        .catch((error) => {});
    });
  }*/

  /*async removeItem(key: string): Promise<void> {
    try {
      const session = await this.db.get<AuthSession>("auth_session").find(key);
      if (session) {
        await this.db.write(async () => {
          await session.destroyPermanently();
          await SecureStore.deleteItemAsync(key);
        });
      }
    } catch (error) {}
  }*/

  async setItem(key: string, value: string): Promise<void> {
    await this.db.write(async () => {
      await this.db
        .get<AuthSession>("auth_session")
        .create((record) => {
          record._raw.id = key; // set key as row id this will help in get and remove item with passed key argument by supabase
          record.session = value; // set value to session field
        })
        .catch((error) => {});
    });
  }

  getItem(key: string): MaybePromisify<string | null> {
    // from auth_session table find collection for passed key
    return this.db
      .get<AuthSession>("auth_session")
      .find(key)
      .then((result) => {
        // just return value of session
        if (result.session) return result.session;
        else return null;
      })
      .catch(() => null);
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
    } catch (error) {}
  }

  private async _encrypt(key: string, value: string) {
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
  }

}

const clientAuthStorageInstance = SupabaseClientStorage.getInstance();



export default clientAuthStorageInstance;
