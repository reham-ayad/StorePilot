
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Login } from '../auth/login/login';
import { Register } from '../auth/register/register';

type AuthMode = 'login' | 'register' | null;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, RouterLink, Login, Register],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  authMode: AuthMode = null;

  openAuth(mode: 'login' | 'register'): void {
    this.authMode = mode;
    this.cdr.markForCheck();
  }

  closeAuth(): void {
    this.authMode = null;
    this.cdr.markForCheck();
  }

  switchAuthMode(mode: 'login' | 'register'): void {
    this.authMode = mode;
    this.cdr.markForCheck();
  }

  onAuthenticated(): void {
    this.authMode = null;
    this.cdr.markForCheck();
    void this.router.navigate(['/dashboard']);
  }

  onModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeAuth();
    }
  }
}
