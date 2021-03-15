import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { ExpenseFormComponent } from './expense-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { ListOfExpensesService } from '../list-of-expenses.service';
import { of } from 'rxjs';
import { getTestScheduler } from 'jasmine-marbles';

describe('ExpenseFormComponent', () => {
  let component: ExpenseFormComponent;
  let fixture: ComponentFixture<ExpenseFormComponent>;
  let service: jasmine.SpyObj<ListOfExpensesService>;
  let overlay: Overlay;
  let overlayContainer: OverlayContainer;

  const getTemplate = (): HTMLElement => fixture.debugElement.nativeElement;
  const getInputDateSelector = () =>
    getTemplate().querySelector('input[test-id="inputDate"]') as HTMLInputElement | null;
  const getInputAmountSelector = () =>
    getTemplate().querySelector('input[test-id="inputAmount"]') as HTMLInputElement | null;
  const getInputCategorySelector = () => getTemplate().querySelector('[test-id="inputCategory"]') as HTMLElement | null;
  const getSubmitButton = () => getTemplate().querySelector('[test-id="buttonSubmit"]') as HTMLButtonElement | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseFormComponent],
      providers: [
        {
          provide: ListOfExpensesService,
          useValue: jasmine.createSpyObj('ListOfExpensesService', ['dbAdd$']),
        },
      ],
      imports: [
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    service = TestBed.inject(ListOfExpensesService) as jasmine.SpyObj<ListOfExpensesService>;
    overlayContainer = TestBed.inject(OverlayContainer);
    overlay = TestBed.inject(Overlay);

    fixture = TestBed.createComponent(ExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display section title', () => {
    getTestScheduler().flush();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h4').innerHTML).toContain('Add new expense');
  });

  it('should user to see form on init', () => {
    expect(getInputDateSelector()).toBeTruthy();
    expect(getInputAmountSelector()).toBeTruthy();
    expect(getInputCategorySelector()).toBeTruthy();
    expect(getSubmitButton()).toBeTruthy();
  });

  it('should user be able to add new expense', () => {
    const spyDbAdd = service.dbAdd$.and.callFake(() => {
      return of([]);
    });
    // Set Date
    // @ts-ignore
    getInputDateSelector()?.value = moment().format('M/DD/YYYY');
    getInputAmountSelector()?.dispatchEvent(new Event('input'));

    // Set Amount
    // @ts-ignore
    getInputAmountSelector()?.value = '123';
    getInputAmountSelector()?.dispatchEvent(new Event('input'));

    // Select Category
    getInputCategorySelector()?.querySelector('.mat-select-trigger')?.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();
    overlayContainer.getContainerElement().querySelector('.mat-option')?.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    // Submit form
    getSubmitButton()?.click();
    fixture.detectChanges();
    // @ts-ignore
    expect(spyDbAdd).toHaveBeenCalledOnceWith({ date: '', amount: 123, category: 'HOME' });
  });
});
