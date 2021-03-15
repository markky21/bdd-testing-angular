import { ListOfExpensesService } from './list-of-expenses.service';
import { Expense } from './list-of-expenses.model';
import { asyncScheduler, BehaviorSubject, Observable, of, scheduled } from 'rxjs';
import { mockExpenseList } from './list-of-expenses.mocks';
import moment from 'moment';

export class ListOfExpensesServiceStub implements Pick<ListOfExpensesService, keyof ListOfExpensesService> {
  selectedMonth$ = new BehaviorSubject<moment.Moment | null>(moment());
  dbAdd$(expense: Expense): Observable<Expense[]> {
    return scheduled(of(mockExpenseList), asyncScheduler);
  }
  dbGetAllFilteredBySelectedMonth$(): Observable<Expense[]> {
    return scheduled(of(mockExpenseList), asyncScheduler);
  }
  getExpensesTotalAmount$(): Observable<number> {
    return scheduled(of(123), asyncScheduler);
  }
}
