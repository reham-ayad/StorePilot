
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="dashboard">
      <header class="topbar">
        <a class="brand" routerLink="/dashboard">
          <span class="brand-icon">S</span>
          StorePilot
        </a>

        <button
          class="logout-button"
          type="button"
          [disabled]="loggingOut"
          (click)="logout()"
        >
          {{ loggingOut ? 'Signing out...' : 'Sign out' }}
        </button>
      </header>

      <section class="welcome">
        <p class="eyebrow">YOUR WORKSPACE</p>
        <h1>Welcome{{ user ? ', ' + user.name : '' }}!</h1>
        <p class="description">
          Your StorePilot account is connected successfully.
        </p>

        @if (user) {
          <div class="user-card">
            <div class="avatar">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>

            <div>
              <h2>{{ user.name }}</h2>
              <p>{{ user.email }}</p>
              <span class="role">{{ user.role }}</span>
            </div>
          </div>
        }

        @if (errorMessage) {
          <p class="error-message" role="alert">
            {{ errorMessage }}
          </p>
        }

        <p class="next-step">
          Next up: store management, products, orders, and analytics.
        </p>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f6f8fc;
      color: #172033;
      font-family: Inter, Arial, sans-serif;
    }

    .topbar {
      height: 76px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 6%;
      background: white;
      border-bottom: 1px solid #e8ecf3;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #172033;
      font-size: 21px;
      font-weight: 800;
      text-decoration: none;
    }

    .brand-icon {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: #3157d5;
      color: white;
      font-size: 21px;
    }

    .logout-button {
      padding: 10px 16px;
      border: 1px solid #dce1eb;
      border-radius: 8px;
      background: white;
      color: #34405a;
      font-weight: 700;
      cursor: pointer;
    }

    .logout-button:disabled {
      opacity: 0.6;
      cursor: wait;
    }

    .welcome {
      max-width: 980px;
      margin: 0 auto;
      padding: 64px 24px;
    }

    .eyebrow {
      color: #3157d5;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
    }

    h1 {
      margin: 14px 0 8px;
      font-size: clamp(28px, 4vw, 38px);
      letter-spacing: -1px;
    }

    .description {
      color: #758096;
      line-height: 1.7;
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 16px;
      max-width: 440px;
      margin-top: 32px;
      padding: 24px;
      border: 1px solid #e8ecf3;
      border-radius: 14px;
      background: white;
      box-shadow: 0 6px 24px #1b2b4b08;
    }

    .avatar {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #e9edff;
      color: #3157d5;
      font-size: 22px;
      font-weight: 800;
    }

    .user-card h2 {
      margin: 0 0 6px;
      font-size: 17px;
    }

    .user-card p {
      margin: 0 0 10px;
      color: #758096;
      font-size: 13px;
    }

    .role {
      display: inline-block;
      padding: 4px 9px;
      border-radius: 20px;
      background: #edf2ff;
      color: #3157d5;
      font-size: 11px;
      font-weight: 700;
      text-transform: capitalize;
    }

    .next-step {
      margin-top: 32px;
      color: #758096;
      font-size: 13px;
    }

    .error-message {
      color: #b42318;
      font-size: 13px;
    }
  `],
})
export class Overview {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loggingOut = false;
  errorMessage = '';

  get user() {
    return this.authService.user;
  }

  logout(): void {
    if (this.loggingOut) return;

    this.loggingOut = true;
    this.errorMessage = '';

    this.authService.logout().subscribe({
      next: () => {
        this.loggingOut = false;
        void this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.loggingOut = false;
        this.errorMessage =
          error.error?.error?.message ??
          'Could not sign out. Please try again.';
      },
    });
  }
}
