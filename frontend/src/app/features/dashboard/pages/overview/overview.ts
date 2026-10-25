import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

interface DashboardStat {
  title: string;
  value: string;
  caption: string;
  period: string;
  icon: string;
  iconClass: string;
}

interface ChartBar {
  day: string;
  value: string;
  height: number;
}

interface ActivityItem {
  title: string;
  description: string;
  time: string;
  icon: string;
  iconClass: string;
}

interface SetupStep {
  title: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  loggingOut = false;
  errorMessage = '';

  // Demo data only — replace with API data when the backend endpoints are ready.
  readonly stats: DashboardStat[] = [
    {
      title: 'Total revenue',
      value: 'EGP 24.8K',
      caption: 'Sample revenue',
      period: 'Preview',
      icon: '↗',
      iconClass: 'purple-icon',
    },
    {
      title: 'Total orders',
      value: '128',
      caption: 'Example order count',
      period: 'Preview',
      icon: '▤',
      iconClass: 'blue-icon',
    },
    {
      title: 'Products',
      value: '64',
      caption: 'Example catalog size',
      period: 'Preview',
      icon: '◇',
      iconClass: 'orange-icon',
    },
    {
      title: 'Active stores',
      value: '3',
      caption: 'Example store count',
      period: 'Preview',
      icon: '⌂',
      iconClass: 'green-icon',
    },
  ];

  readonly chartBars: ChartBar[] = [
    { day: 'Mon', value: '2.1k', height: 38 },
    { day: 'Tue', value: '3.4k', height: 58 },
    { day: 'Wed', value: '2.8k', height: 47 },
    { day: 'Thu', value: '4.2k', height: 72 },
    { day: 'Fri', value: '3.1k', height: 53 },
    { day: 'Sat', value: '5.0k', height: 88 },
    { day: 'Sun', value: '4.2k', height: 72 },
  ];

  readonly activities: ActivityItem[] = [
    {
      title: 'Workspace created',
      description: 'Your StorePilot workspace is ready.',
      time: 'Getting started',
      icon: '✓',
      iconClass: 'activity-green',
    },
    {
      title: 'Product catalog',
      description: 'Add products to prepare your catalog.',
      time: 'Next step',
      icon: '◇',
      iconClass: 'activity-purple',
    },
    {
      title: 'Order management',
      description: 'Your orders will appear here.',
      time: 'Coming next',
      icon: '▤',
      iconClass: 'activity-blue',
    },
  ];

  readonly setupSteps: SetupStep[] = [
    {
      title: 'Create a store',
      description: 'Set up your business space',
      status: 'To do',
    },
    {
      title: 'Add products',
      description: 'Build your product catalog',
      status: 'To do',
    },
    {
      title: 'Manage orders',
      description: 'Track incoming purchases',
      status: 'Upcoming',
    },
  ];

  get user() {
    return this.authService.user;
  }

  logout(): void {
    if (this.loggingOut) {
      return;
    }

    this.loggingOut = true;
    this.errorMessage = '';

    this.authService.logout().subscribe({
      next: () => {
        this.loggingOut = false;
        this.cdr.markForCheck();
        void this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        this.loggingOut = false;
        this.errorMessage =
          error.error?.error?.message ??
          error.error?.message ??
          'Could not sign out. Please try again.';

        this.cdr.markForCheck();
      },
    });
  }
}