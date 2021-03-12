import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthSelectorComponent } from './month-selector.component';
import { ListOfExpensesService } from '../list-of-expenses.service';
import MockDate from 'mockdate';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import * as moment from 'moment';
import { DATE_FORMATS } from '../../utils/dates.utils';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { of } from 'rxjs';
import { mockExpenseList } from '../list-of-expenses.mocks';

describe('MonthSelectorComponent', () => {
  const currentDate = new Date(2020, 3, 21);
  let component: MonthSelectorComponent;
  let fixture: ComponentFixture<MonthSelectorComponent>;
  let listOfExpensesService: ListOfExpensesService;
  let overlay: Overlay;
  let overlayContainer: OverlayContainer;

  let spyNgxIndexedDBService: jasmine.SpyObj<NgxIndexedDBService>;

  const getTemplate = (): HTMLElement => fixture.debugElement.nativeElement;
  const getInputMothSelector = () =>
    getTemplate().querySelector('input[test-id="inputMonthSelector"]') as HTMLInputElement | null;
  const getInputMothSelectorToggle = () =>
    getTemplate().querySelector('[test-id="inputMonthSelectorToggle"] button') as HTMLButtonElement | null;
  const getMatCalendarContent = () =>
    overlayContainer.getContainerElement().querySelector('mat-calendar') as HTMLElement | null;

  beforeAll(() => {
    MockDate.set(currentDate);
  });

  afterAll(() => {
    MockDate.reset();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthSelectorComponent],
      providers: [
        {
          provide: NgxIndexedDBService,
          useValue: jasmine.createSpyObj('NgxIndexedDBService', ['createObjectStore', 'getAll', 'add']),
        },
      ],
      imports: [MatInputModule, MatDatepickerModule, ReactiveFormsModule, MatNativeDateModule, NoopAnimationsModule],
    }).compileComponents();

    spyNgxIndexedDBService = TestBed.inject(NgxIndexedDBService) as jasmine.SpyObj<NgxIndexedDBService>;
    spyNgxIndexedDBService.getAll.and.returnValue(of(mockExpenseList));
    listOfExpensesService = TestBed.inject(ListOfExpensesService);
    overlayContainer = TestBed.inject(OverlayContainer);
    overlay = TestBed.inject(Overlay);

    fixture = TestBed.createComponent(MonthSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially set to current month', () => {
    const spySelectedMonths$ = spyOn(listOfExpensesService.selectedMonth$, 'next');
    component.ngOnInit();
    expect(spySelectedMonths$).toHaveBeenCalledOnceWith(moment());
    expect(getInputMothSelector()?.value).toContain(moment().format(DATE_FORMATS.display.dateInput).toString());
  });

  it('should allow user to select months in the past', async () => {
    const spyListOfExpensesService = spyOn(listOfExpensesService.selectedMonth$, 'next');
    getInputMothSelectorToggle()?.click();
    fixture.detectChanges();
    expect(getMatCalendarContent()).toBeTruthy();

    // Select previous month in datepicker
    getMatCalendarContent()
      ?.querySelectorAll('.mat-calendar-body .mat-calendar-body-cell')
      .item(2)
      .dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();
    expect(getInputMothSelector()?.value).toContain(
      moment(new Date(2020, 2, 21)).format(DATE_FORMATS.display.dateInput).toString()
    );

    // Check if new value was send
    // @ts-ignore
    expect(spyListOfExpensesService).toHaveBeenCalledOnceWith(moment().add(-1, 'months'));
  });

  it('should disallow user to select months in the feature', () => {
    getInputMothSelectorToggle()?.click();
    fixture.detectChanges();
    expect(getMatCalendarContent()).toBeTruthy();

    // Select month in future in datepicker
    getMatCalendarContent()
      ?.querySelectorAll('.mat-calendar-body .mat-calendar-body-cell')
      .item(4)
      .dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();
    expect(getInputMothSelector()?.value).toContain(moment().format(DATE_FORMATS.display.dateInput).toString());
  });
});
