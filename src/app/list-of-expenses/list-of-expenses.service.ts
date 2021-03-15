import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, concat, Observable, Subject } from 'rxjs';
import moment from 'moment';
import { NgxIndexedDBService, ObjectStoreMeta } from 'ngx-indexed-db';
import { Expense } from './list-of-expenses.model';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';

const storeSchema: ObjectStoreMeta = {
  store: 'expenses',
  storeConfig: { keyPath: 'id', autoIncrement: true },
  storeSchema: [
    { name: 'date', keypath: 'expenseDate', options: { unique: false } },
    { name: 'amount', keypath: 'amount', options: { unique: false } },
    { name: 'category', keypath: 'amount', options: { unique: false } },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class ListOfExpensesService {
  private abAll$ = new Subject<Expense[]>();
  selectedMonth$ = new BehaviorSubject<moment.Moment | null>(null);

  constructor(private ngxIndexedDBService: NgxIndexedDBService<Expense>) {
    ngxIndexedDBService.createObjectStore(storeSchema);
  }

  dbAdd$(expense: Expense): Observable<Expense[]> {
    return this.ngxIndexedDBService.add(storeSchema.store, expense).pipe(
      mergeMap(() => this.ngxIndexedDBService.getAll(storeSchema.store)),
      tap((value) => this.abAll$.next(value)),
      take(1)
    );
  }

  private dbGetAll$(): Observable<Expense[]> {
    return concat(this.ngxIndexedDBService.getAll(storeSchema.store), this.abAll$);
  }

  dbGetAllFilteredBySelectedMonth$(): Observable<Expense[]> {
    return combineLatest([this.dbGetAll$(), this.selectedMonth$]).pipe(
      filter(([expenses, selectedMonth]) => !!(expenses && selectedMonth)),
      map(([expenses, selectedMonth]) => {
        return expenses.filter((e) => moment(e.date).isSame(selectedMonth, 'month'));
      })
    );
  }

  getExpensesTotalAmount$(): Observable<number> {
    return this.dbGetAllFilteredBySelectedMonth$().pipe(
      map((expenses) => expenses.reduce((acc, e) => acc + e.amount, 0))
    );
  }
}
