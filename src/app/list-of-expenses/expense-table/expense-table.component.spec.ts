import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTableComponent } from './expense-table.component';
import { ListOfExpensesService } from '../list-of-expenses.service';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { mockExpenseList } from '../list-of-expenses.mocks';
import { MatTableModule } from '@angular/material/table';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { of } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';

describe('ExpenseTableComponent', () => {
  let component: ExpenseTableComponent;
  let fixture: ComponentFixture<ExpenseTableComponent>;
  let spyListOfExpensesService: jasmine.SpyObj<ListOfExpensesService>;
  let spyNgxIndexedDBService: jasmine.SpyObj<NgxIndexedDBService>;

  const getTemplate = (): HTMLElement => fixture.debugElement.nativeElement;
  const getExpenseTable = () => getTemplate().querySelector('[test-id="expenseTable"]') as HTMLTableElement | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseTableComponent],
      providers: [
        {
          provide: NgxIndexedDBService,
          useValue: jasmine.createSpyObj('NgxIndexedDBService', ['createObjectStore', 'getAll', 'add']),
        },
        {
          provide: ListOfExpensesService,
          useValue: jasmine.createSpyObj('ListOfExpensesService', [
            'dbGetAllFilteredBySelectedMonth$',
            'getExpensesTotalAmount$',
          ]),
        },
      ],
      imports: [MatTableModule],
    }).compileComponents();
    spyListOfExpensesService = TestBed.inject(ListOfExpensesService) as jasmine.SpyObj<ListOfExpensesService>;
    spyListOfExpensesService.dbGetAllFilteredBySelectedMonth$.and.returnValue(cold('a-', { a: mockExpenseList }));
    spyListOfExpensesService.getExpensesTotalAmount$.and.callThrough();
    spyNgxIndexedDBService = TestBed.inject(NgxIndexedDBService) as jasmine.SpyObj<NgxIndexedDBService>;
    spyNgxIndexedDBService.getAll.and.returnValue(of(mockExpenseList));

    fixture = TestBed.createComponent(ExpenseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display section title', () => {
    getTestScheduler().flush();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h4').innerHTML).toContain('Expenses');
  });

  it('should present table with headings', () => {
    getTestScheduler().flush();
    fixture.detectChanges();
    expect(getExpenseTable()?.querySelector('[test-id="expenseTable-headerDate"]')?.innerHTML).toContain('Date');
    expect(getExpenseTable()?.querySelector('[test-id="expenseTable-headerCategory"]')?.innerHTML).toContain(
      'Category'
    );
    expect(getExpenseTable()?.querySelector('[test-id="expenseTable-headerAmount"]')?.innerHTML).toContain('Amount');
  });

  it('should present table data', () => {
    getTestScheduler().flush();
    fixture.detectChanges();

    getExpenseTable()
      ?.querySelectorAll('[test-id="expenseTable-cellDate"]')
      .forEach((el, i) => {
        expect(el.innerHTML).toContain(new DatePipe('en_US').transform(mockExpenseList[i].date) as string);
      });
    getExpenseTable()
      ?.querySelectorAll('[test-id="expenseTable-cellCategory"]')
      .forEach((el, i) => {
        expect(el.innerHTML).toContain(mockExpenseList[i].category);
      });
    getExpenseTable()
      ?.querySelectorAll('[test-id="expenseTable-cellAmount"]')
      .forEach((el, i) => {
        expect(el.innerHTML).toContain(new CurrencyPipe('en_US').transform(mockExpenseList[i].amount) as string);
      });
  });
});
