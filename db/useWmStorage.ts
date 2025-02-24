import { useCallback } from "react"
import { log } from "app/utils/logger"
import database from "./index"
import TransactionModel from "./models/TransactionModel"
import { Q } from "@nozbe/watermelondb"
import CategoryModel from "./models/CategoryModel"

export interface TransactionData {
  userId?: string;
  amount: number;
  description: string;
  categoryId?: string;
  category?: CategoryModel;
  transactionAt?: Date;
  type?: "expense" | "income";
  isRecurring?: boolean
}

export interface TransactionFiltersI {
  userId?: string;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  categoryId?: string;
}

export const useWmStorage = () => {
  // Retrieve transactions
  const getTransactionsWithFilter = useCallback(async ({userId, categoryId, startDate, endDate} : TransactionFiltersI) => {
    try {
      const transactionsCollection = database.get<TransactionModel>('transactions');
      let query = transactionsCollection.query();

      if (userId) {
        query = query.extend(Q.where('user_id', userId));
      }

      if (startDate && endDate) {
        query = query.extend(Q.between('created_at', startDate, endDate));
      }

      if (categoryId) {
        query = query.extend(Q.where('categoryId', categoryId));
      }

      return await query.fetch();
    } catch (error) {
      log.error('Error fetching transactions', error);
      throw error;
    }
  }, []);

  // Save a new transaction
  const addNewTransaction = useCallback(async (transactionData : TransactionData) => {
    try {
      return await database.write(async () => {
        const newTransaction = await database.get<TransactionModel>('transactions').create(transaction => {
          transaction.userId = transactionData.userId;
          transaction.amount = transactionData.amount;
          transaction.description = transactionData.description;
          if (transactionData.categoryId) transaction.categoryId = transactionData.categoryId;
          if (transactionData.type) transaction.type = transactionData.type;
          if (transactionData.transactionAt) transaction.transactionAt = transactionData.transactionAt;
          transaction.isRecurring = transactionData.isRecurring || false;
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
  const updateTransaction = useCallback(async (transactionId : string, updateData : TransactionData) => {
    try {
      return await database.write(async () => {
        const transaction = await database.get<TransactionModel>('transactions').find(transactionId);

        await transaction.update(record => {
          if (updateData.amount !== undefined) record.amount = updateData.amount;
          if (updateData.description !== undefined) record.description = updateData.description;
          if (updateData.categoryId !== undefined) record.categoryId = updateData.categoryId;
          if (updateData.transactionAt !== undefined) record.transactionAt = new Date(updateData.transactionAt);
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
    getTransactionsWithFilter,
    addNewTransaction,
    updateTransaction,
    deleteTransaction
  };
};