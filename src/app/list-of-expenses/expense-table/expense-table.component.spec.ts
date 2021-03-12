import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTableComponent } from './expense-table.component';
import { ListOfExpensesService } from '../list-of-expenses.service';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { mockExpenseList } from '../list-of-expenses.mocks';
import { MatTableModule } from '@angular/material/table';
import {} from 'rxjs/testing';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {of} from 'rxjs';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should present table with headings', () => {
    it('expense date', () => {
      getTestScheduler().flush();
      fixture.detectChanges();
      expect(getExpenseTable()?.querySelector('[test-id="expenseTable-headerDate"]')?.innerHTML).toContain('Date');
    });
    it('expense category', () => {
      getTestScheduler().flush();
      fixture.detectChanges();
      expect(getExpenseTable()?.querySelector('[test-id="expenseTable-headerCategory"]')?.innerHTML).toContain(
        'Category'
      );
    });
    it('expense amount', () => {
      getTestScheduler().flush();
      fixture.detectChanges();
      expect(getExpenseTable()?.querySelector('[test-id="expenseTable-headerAmount"]')?.innerHTML).toContain('Amount');
    });
  });
});
