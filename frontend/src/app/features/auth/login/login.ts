
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../app/core/services/auth.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { output,input } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
private snackBar= inject(MatSnackBar)
  loading = false;
  errorMessage = '';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
modalMode = input(false);
authenticated = output<void>();
switchToRegister = output<void>();
  submit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.getRawValue()).subscribe({
   next: () => {
  this.loading = false;

  if (this.modalMode()) {
    this.authenticated.emit();
  } else {
    void this.router.navigate(['/dashboard']);
  }

  this.snackBar.open('Login Successful!', 'Close', {
    duration: 3000,
    panelClass: ['success-snackbar'],
    horizontalPosition: 'end',
    verticalPosition: 'top',
  });
},
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage =
          error.error?.error?.message ??
          error.error?.message ??
          
          'Unable to log in. Please check your credentials and try again.';
          
  this.snackBar.open('Unable to log in. Please check your credentials and try again.', 'Close', {
    duration: 4000,
    panelClass: ['error-snackbar'],
    horizontalPosition: 'end',
    verticalPosition: 'top'
  });

      },
    });
  }
}
