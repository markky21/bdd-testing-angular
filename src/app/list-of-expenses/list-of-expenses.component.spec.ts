import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfExpensesComponent } from './list-of-expenses.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ListOfExpensesComponent', () => {
  let component: ListOfExpensesComponent;
  let fixture: ComponentFixture<ListOfExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListOfExpensesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display page title', () => {
    expect(fixture.nativeElement.querySelector('mat-card-title').innerHTML).toContain('List of expenses');
  });

  it('should display page components', () => {
    expect(fixture.nativeElement.querySelector('app-month-selector')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-expense-table')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-expense-form')).toBeTruthy();
  });
});
