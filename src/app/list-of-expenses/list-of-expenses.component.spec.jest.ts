import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfExpensesComponent } from './list-of-expenses.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// NOTE: If a component is only used to display an assembly of components,
// then we should do a test to see if these components are visible in the DOM.
// However, we don't need to bootstrap these components,
// so we should omit including dependencies in ModuleDef and set NO_ERRORS_SCHEMA

describe('ListOfExpensesComponent', () => {
  let fixture: ComponentFixture<ListOfExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListOfExpensesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfExpensesComponent);
    fixture.detectChanges();
  });

  it('should display page components', () => {
    expect(fixture).toMatchSnapshot();
  });
});
