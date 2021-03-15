import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// NOTE: If a component is only used to display an assembly of components,
// then we should do a test to see if these components are visible in the DOM.
// However, we don't need to bootstrap these components,
// so we should omit including dependencies in ModuleDef and set NO_ERRORS_SCHEMA

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should display page components', () => {
    expect(fixture.nativeElement.querySelector('app-header')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-list-of-expenses')).toBeTruthy();
  });
});
