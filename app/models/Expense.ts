export interface Expense {
  id: string;
  description: string;
  value: number;
  categoryId: string;
  date: string;
  recurrent: boolean;
  type: string;
}