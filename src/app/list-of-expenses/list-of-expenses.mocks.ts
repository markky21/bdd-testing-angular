import * as moment from 'moment';
import { Expense, ExpenseCategory } from './list-of-expenses.model';

export const mockExpenseList: Expense[] = [
  {
    id: 1,
    date: moment().add(-5, 'days').toISOString(),
    amount: 15.5,
    category: ExpenseCategory.CAR,
  },
  {
    id: 2,
    date: moment().add(-9, 'days').toISOString(),
    amount: 163.5,
    category: ExpenseCategory.HOME,
  },
  {
    id: 3,
    date: moment().add(-10, 'days').toISOString(),
    amount: 5.5,
    category: ExpenseCategory.HOME,
  },
];

export const getMockExpenseList: () => Expense[] = () => [
  {
    id: 1,
    date: moment().add(-5, 'days').toISOString(),
    amount: 15.5,
    category: ExpenseCategory.CAR,
  },
  {
    id: 2,
    date: moment().add(-9, 'days').toISOString(),
    amount: 163.5,
    category: ExpenseCategory.HOME,
  },
  {
    id: 3,
    date: moment().add(-10, 'days').toISOString(),
    amount: 5.5,
    category: ExpenseCategory.HOME,
  },
];
