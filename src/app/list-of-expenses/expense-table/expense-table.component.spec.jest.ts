import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTableComponent } from './expense-table.component';
import { ListOfExpensesService } from '../list-of-expenses.service';
import { mockExpenseList } from '../list-of-expenses.mocks';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ListOfExpensesServiceStub } from '../list-of-expenses.service.stub';

// NOTE: In Angular Component tests we should mainly focus on testing component DOM structure changes
// and less on how things are implemented.

describe('ExpenseTableComponent', () => {
  let component: ExpenseTableComponent;
  let fixture: ComponentFixture<ExpenseTableComponent>;
  let listOfExpensesService: ListOfExpensesService;

  const getTemplate = (): HTMLElement => fixture.debugElement.nativeElement;
  const getExpenseTable = () => getTemplate().querySelector('[test-id="expenseTable"]') as HTMLTableElement | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseTableComponent],
      providers: [{ provide: ListOfExpensesService, useClass: ListOfExpensesServiceStub }],
      imports: [MatTableModule],
    }).compileComponents();

    listOfExpensesService = TestBed.inject(ListOfExpensesService);
    fixture = TestBed.createComponent(ExpenseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display section title', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h4').innerHTML).toContain('Expenses');
  });

  it('should present table data', () => {
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
