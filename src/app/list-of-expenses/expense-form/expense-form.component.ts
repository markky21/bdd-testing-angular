import { Component } from '@angular/core';
import { ExpenseCategory } from '../list-of-expenses.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListOfExpensesService } from '../list-of-expenses.service';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
})
export class ExpenseFormComponent {
  expenseCategory = Object.values(ExpenseCategory);
  form: FormGroup = this.formBuilder.group({
    date: ['', Validators.required],
    amount: ['', Validators.required],
    category: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private listOfExpensesService: ListOfExpensesService) {}

  onSubmit(form: FormGroup): void {
    this.listOfExpensesService.dbAdd$(form.value).subscribe();
  }
}
