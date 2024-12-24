import { Expense } from "app/models/Expense"
import { create } from "zustand"

export interface ExpensesState {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  removeExpense: (expense: Expense) => void;
  // editExpense: (expense: Expense) => void;
}

export const useExpensesStore = create<ExpensesState>((set) => ({
  expenses: [],
  addExpense: (newExpense: Expense) => set((state) => {
    return {
      expenses: [...state.expenses, newExpense],
    }
  }),
  removeExpense: (expense: Expense) => set((state) => {
    return {
      expenses: state.expenses.filter((expenseToBeRemoved) => expenseToBeRemoved.id !== expense.id),
    }
  })
}))