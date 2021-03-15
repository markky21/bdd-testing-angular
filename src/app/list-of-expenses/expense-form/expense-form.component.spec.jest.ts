import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';
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
import { ExpenseCategory } from '../list-of-expenses.model';
import { ListOfExpensesServiceStub } from '../list-of-expenses.service.stub';

// NOTE: In Angular Component tests we should mainly focus on testing component DOM structure changes
// and less on how things are implemented.

describe('ExpenseFormComponent', () => {
  let component: ExpenseFormComponent;
  let fixture: ComponentFixture<ExpenseFormComponent>;
  let service: ListOfExpensesService;
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
      providers: [{ provide: ListOfExpensesService, useClass: ListOfExpensesServiceStub }],
      imports: [
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    service = TestBed.inject(ListOfExpensesService);
    overlayContainer = TestBed.inject(OverlayContainer);
    overlay = TestBed.inject(Overlay);

    fixture = TestBed.createComponent(ExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display page components', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should user be able to add new expense', () => {
    const spyDbAdd = spyOn(service, 'dbAdd$').and.callFake(() => {
      return of([]);
    });
    // Set Date
    // tslint:disable-next-line:no-non-null-assertion
    getInputDateSelector()!.value = moment().format('M/DD/YYYY');
    getInputAmountSelector()?.dispatchEvent(new Event('input'));

    // Set Amount
    // tslint:disable-next-line:no-non-null-assertion
    getInputAmountSelector()!.value = '123';
    getInputAmountSelector()?.dispatchEvent(new Event('input'));

    // Select Category
    getInputCategorySelector()?.querySelector('.mat-select-trigger')?.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();
    overlayContainer.getContainerElement().querySelector('.mat-option')?.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    // Submit form
    getSubmitButton()?.click();
    fixture.detectChanges();
    expect(spyDbAdd).toHaveBeenCalledWith({ date: '', amount: 123, category: ExpenseCategory.HOME });
  });
});
