
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
  };
}

interface LogoutResponse {
  success: boolean;
  data: {
    message: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/auth';

  private currentUser: AuthUser | null = null;

  get user(): AuthUser | null {
    return this.currentUser;
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.currentUser = response.data.user;
        })
      );
  }

  register(data: {
    name: string;
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap((response) => {
          this.currentUser = response.data.user;
        })
      );
  }

  me(): Observable<AuthResponse> {
    return this.http
      .get<AuthResponse>(`${this.apiUrl}/me`)
      .pipe(
        tap((response) => {
          this.currentUser = response.data.user;
        })
      );
  }

  logout(): Observable<LogoutResponse> {
    return this.http
      .post<LogoutResponse>(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.currentUser = null;
        })
      );
  }
}
