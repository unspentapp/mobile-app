import expensesData from './expensesData.json'
import categoriesData from './categoriesData.json'
import { Expense } from "app/models/Expense"
import { Category } from "app/models/Category"

export const getCategories = (): Category[] => {
  return categoriesData.categories
}

export const getExpenses = (): Expense[] => {
  return expensesData.expenses
}