import { useCallback } from 'react';
import { log } from "app/utils/logger";
import database from "./index"
import TransactionModel from "./models/TransactionModel"

export interface TransactionDataI {
  userId: string;
  amount: number;
  description: string;
  categoryId?: string;
}

export const useWmStorage = () => {
  // Save a new transaction
  const saveTransaction = useCallback(async (transactionData : TransactionDataI) => {
    try {
      return await database.write(async () => {
        const newTransaction = await database.get<TransactionModel>('transactions').create(transaction => {
          transaction.userId = transactionData.userId;
          transaction.amount = transactionData.amount;
          transaction.description = transactionData.description;
          transaction.categoryId = transactionData.categoryId;
        });

        log.debug(`Transaction added: ${newTransaction.id}`);
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
    saveTransaction,
    updateTransaction,
    deleteTransaction
  };
};