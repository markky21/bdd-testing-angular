export enum ExpenseCategory {
  HOME = 'HOME',
  CAR = 'CAR',
}

export interface Expense {
  id?: number;
  date: string;
  amount: number;
  category: ExpenseCategory;
}
