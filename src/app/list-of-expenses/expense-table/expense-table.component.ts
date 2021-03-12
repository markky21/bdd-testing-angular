import { Component } from '@angular/core';
import { ListOfExpensesService } from '../list-of-expenses.service';
import { Expense } from '../list-of-expenses.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-expense-table',
  templateUrl: './expense-table.component.html',
  styleUrls: ['./expense-table.component.scss'],
})
export class ExpenseTableComponent {
  displayedColumns: string[] = ['id', 'date', 'category', 'amount'];
  expenses$: Observable<Expense[]> = this.listOfExpensesService.dbGetAllFilteredBySelectedMonth$();
  totalAmount$: Observable<number> = this.listOfExpensesService.getExpensesTotalAmount$();

  constructor(private listOfExpensesService: ListOfExpensesService) {}
}
