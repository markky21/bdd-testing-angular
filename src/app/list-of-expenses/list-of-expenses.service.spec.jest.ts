import { ListOfExpensesService } from './list-of-expenses.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { getMockExpenseList, mockExpenseList } from './list-of-expenses.mocks';
import { Expense } from './list-of-expenses.model';
import { cold } from 'jest-marbles';
import MockDate from 'mockdate';

// NOTE: To be able to test class methods we don't need to use TestBed
// for set application environment (dependencies in this case).
// We can create class instance and provide dependencies manually

// NOTE: For RxJs streams we should use write marble tests:
// https://rxjs-dev.firebaseapp.com/guide/testing/internal-marble-tests

// NOTE: With our tests we should mock as much as possible.
// Also we should keep on mind that we should not test functionalities of external libraries.

jest.mock('ngx-indexed-db', () => {
  return {
    NgxIndexedDBService: jest.fn().mockImplementation(() => {
      return {
        add: jest.fn().mockReturnValue(cold('a')),
        getAll: jest.fn().mockReturnValue(cold('b')),
        createObjectStore: jest.fn(),
      };
    }),
  };
});

describe('ListOfExpensesService', () => {
  const currentDate = new Date(2020, 3, 21);

  let service: ListOfExpensesService;
  let spyNgxIndexedDBService: NgxIndexedDBService;

  beforeAll(() => {
    MockDate.set(currentDate);
  });
  afterAll(() => {
    MockDate.reset();
  });
  beforeEach(() => {
    spyNgxIndexedDBService = new NgxIndexedDBService(null as any, null);
    service = new ListOfExpensesService(spyNgxIndexedDBService);
  });

  describe('expenses history', () => {
    it('should user be able do register new expense', () => {
      expect(service.dbAdd$(mockExpenseList[0])).toBeObservable(cold('(b|)'));
      expect(spyNgxIndexedDBService.add).toHaveBeenCalledWith('expenses', mockExpenseList[0]);
    });

    it('should return expenses for given month', () => {
      const selectedMonth$ = cold(' --a--b---', { a: new Date().setMonth(new Date().getMonth() - 1), b: new Date() });
      const getAllStream$ = cold('  -a-----b-', {
        a: getMockExpenseList().map((e) => ({ ...e, date: new Date(e.date).setMonth(new Date().getMonth() - 1) })),
        b: getMockExpenseList(),
      });
      const expectedStream$ = cold('--a--b-c-', {
        a: getMockExpenseList().map((e) => ({ ...e, date: new Date(e.date).setMonth(new Date().getMonth() - 1) })),
        b: [],
        c: getMockExpenseList(),
      });

      // @ts-ignore
      service.selectedMonth$ = selectedMonth$;
      spyNgxIndexedDBService.getAll = jest.fn().mockReturnValue(getAllStream$);

      expect(service.dbGetAllFilteredBySelectedMonth$()).toBeObservable(expectedStream$);
    });

    it('should return expenses total amount', () => {
      const testExpenses1: Pick<Expense, 'amount'>[] = [{ amount: 1 }, { amount: 2 }];
      const testExpenses2: Pick<Expense, 'amount'>[] = [{ amount: 1 }, { amount: 2 }, { amount: 3 }];
      const expensesStream$ = cold('a-b', { a: testExpenses1, b: testExpenses2 });
      const resultStream$ = cold('a-b', { a: 3, b: 6 });
      spyOn(service, 'dbGetAllFilteredBySelectedMonth$').and.returnValue(expensesStream$);

      expect(service.getExpensesTotalAmount$()).toBeObservable(resultStream$);
    });
  });
});
