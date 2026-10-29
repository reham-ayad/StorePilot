import { Component, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../../app/core/services/auth.service';

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
  private readonly snackBar = inject(MatSnackBar);

  loading = false;
  errorMessage = '';

  modalMode = input(false);
  authenticated = output<void>();
  switchToRegister = output<void>();

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.loading = false;

        this.snackBar.open('Login Successful!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });

        // Keep the existing modal behavior.
        if (this.modalMode()) {
          this.authenticated.emit();
          return;
        }

        // Redirect according to the authenticated user's role.
        const user = response.data.user;

        if (user.role === 'super_admin') {
          void this.router.navigate(['/admin']);
          return;
        }

        if (user.role === 'owner') {
          void this.router.navigate(['/dashboard']);
          return;
        }

        // Fallback for an unrecognized role.
        this.snackBar.open(
          'Your account does not have dashboard access.',
          'Close',
          {
            duration: 4000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'end',
            verticalPosition: 'top',
          }
        );
      },

      error: (error: HttpErrorResponse) => {
        this.loading = false;

        this.errorMessage =
          error.error?.error?.message ??
          error.error?.message ??
          'Unable to log in. Please check your credentials and try again.';

        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }
}
