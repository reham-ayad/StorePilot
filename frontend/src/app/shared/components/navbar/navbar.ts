
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink,RouterLinkActive } from '@angular/router';
import { output } from '@angular/core';
interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'super_admin' | string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
  };
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly apiUrl = 'http://localhost:5000/api';

  user: AuthUser | null = null;
  menuOpen = false;

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  requestLogin = output<void>();
requestRegister = output<void>();



  loadCurrentUser(): void {
    this.http
      .get<AuthResponse>(`${this.apiUrl}/auth/me`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          this.user = response.data.user;
          this.cdr.markForCheck();
        },
        error: () => {
          this.user = null;
          this.cdr.markForCheck();
        },
      });
  }

  
openSuperAdmin(): void {
  this.menuOpen = false;

  if (this.user?.role === 'super_admin') {
    this.router.navigate(['/admin']);
    return;
  }

  if (this.user?.role === 'owner') {
    this.router.navigate(['/dashboard']);
    return;
  }

  this.router.navigate(['/login']);
}

  openStoreDashboard(): void {
    this.menuOpen = false;

    if (this.user?.role === 'owner') {
      this.router.navigate(['/dashboard']);
      return;
    }

    if (this.user?.role === 'super_admin') {
      this.router.navigate(['/admin']);
      return;
    }

    this.router.navigate(['/login']);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.cdr.markForCheck();
  }
  

}
