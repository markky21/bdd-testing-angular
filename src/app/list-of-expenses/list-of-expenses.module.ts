import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOfExpensesComponent } from './list-of-expenses.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ExpenseTableComponent } from './expense-table/expense-table.component';
import { MonthSelectorComponent } from './month-selector/month-selector.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [ListOfExpensesComponent, ExpenseTableComponent, MonthSelectorComponent, ExpenseFormComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
  ],
  exports: [ListOfExpensesComponent],
})
export class ListOfExpensesModule {}
