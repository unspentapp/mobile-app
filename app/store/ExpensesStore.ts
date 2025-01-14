import { Expense } from "app/models/Expense"
import { create } from "zustand"
import { getExpenses } from "assets/data"

export interface ExpensesState {
  expenses: Expense[];
  totalExpenses: number;
  addExpense: (expense: Expense) => void;
  removeExpense: (expense: Expense) => void;
  editExpense: (expense: Expense) => void;
}

export const useExpensesStore = create<ExpensesState>((set) => ({
  expenses: getExpenses(),
  totalExpenses: 0,
  addExpense: (newExpense: Expense) => set((state) => {
    return {
      expenses: [...state.expenses, newExpense],
      totalExpenses: state.totalExpenses + newExpense.value,
    }
  }),
  removeExpense: (expense: Expense) => set((state) => {
    return {
      expenses: state.expenses.filter((expenseToBeRemoved) => expenseToBeRemoved.id !== expense.id),
      totalExpenses: state.totalExpenses - expense.value,
    }
  }),
  editExpense: (updatedExpense: Expense) => set((state) => {
    const oldExpense = state.expenses.find((e) => e.id === updatedExpense.id);
    const valueDifference = oldExpense ? updatedExpense.value - oldExpense.value : 0;

    return {
      expenses: state.expenses.map((e) =>
        e.id === updatedExpense.id ? updatedExpense : e
      ),
      totalExpenses: state.totalExpenses + valueDifference
    };
  }),
}))