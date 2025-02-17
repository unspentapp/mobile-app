import { useCallback } from "react"
import { log } from "app/utils/logger"
import database from "./index"
import TransactionModel from "./models/TransactionModel"
import { Q } from "@nozbe/watermelondb"

export interface TransactionDataI {
  id?: string
  userId?: string;
  amount: number;
  description: string;
  categoryId?: string;
  category?: CategoryDataI,
  type: "expense" | "income";
  transactionAt: Date;
  isRecurring?: boolean;
}

export interface getTransactionFiltersI {
  userId: string;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  category?: string;
}

export interface CategoryDataI {
  id?: string
  userId?: string
  name: string
  type: "expense" | "income"
  isDefault: boolean
  icon?: string
  color?: string
}

export const useWmStorage = () => {
  // Retrieve transactions
  const getTransactions = useCallback(async (filters : getTransactionFiltersI) => {
    try {
      const transactionsCollection = database.get('transactions');
      let query = transactionsCollection.query(
        Q.where('user_id', filters.userId)
      );

      if (filters.startDate && filters.endDate) {
        query = query.extend(Q.between('created_at', filters.startDate, filters.endDate));
      }

      if (filters.category) {
        query = query.extend(Q.where('category', filters.category));
      }

      return await query.fetch();
    } catch (error) {
      log.error('Error fetching transactions', error);
      throw error;
    }
  }, []);

  // Save a new transaction
  const saveTransaction = useCallback(async (transactionData : TransactionDataI) => {
    try {
      return await database.write(async () => {
        const newTransaction = await database.get<TransactionModel>('transactions').create(transaction => {
          transaction.userId = transactionData.userId;
          transaction.amount = transactionData.amount;
          transaction.description = transactionData.description;
          transaction.categoryId = transactionData.categoryId;
          transaction.type = transactionData.type;
          transaction.transactionAt = transactionData.transactionAt;
          transaction.isRecurring = transactionData.isRecurring;
        });

        log.debug(`Transaction added: ${newTransaction.id}`);
        log.debug(newTransaction.transactionAt);
        return newTransaction;
      });
    } catch (error) {
        log.error('Error saving transaction', error);
      throw error;
    }
  }, []);

  // Update an existing transaction
  const updateTransaction = useCallback(async (transactionId : string, updateData : TransactionModel) => {
    try {
      return await database.write(async () => {
        const transaction = await database.get<TransactionModel>('transactions').find(transactionId);

        await transaction.update(record => {
          if (updateData.amount !== undefined) record.amount = updateData.amount;
          if (updateData.description !== undefined) record.description = updateData.description;
          if (updateData.categoryId !== undefined) record.categoryId = updateData.categoryId;
          record.updatedAt = Date.now();
        });

        log.debug(`Transaction updated: ${transactionId}`);
        return transaction;
      });
    } catch (error) {
        log.error('Error updating transaction', error);
      throw error;
    }
  }, []);

  // Delete a transaction
  const deleteTransaction = useCallback(async (transactionId : string) => {
    try {
      return await database.write(async () => {
        const transaction = await database.get<TransactionModel>('transactions').find(transactionId);
        await transaction.markAsDeleted();

        log.debug(`Transaction deleted: ${transactionId}`);
        return true;
      });
    } catch (error) {
        log.error('Error deleting transaction', error);
      throw error;
    }
  }, []);

  return {
    getTransactions,
    saveTransaction,
    updateTransaction,
    deleteTransaction
  };
};