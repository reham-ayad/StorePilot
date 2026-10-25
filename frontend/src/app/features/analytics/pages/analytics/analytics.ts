
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

interface AnalyticsSummary {
  totalStores: number;
  totalProducts: number;
  totalOrders: number;
  monthlyOrders: number;
  monthlyRevenue: number;
}

interface AnalyticsSubscription {
  status: string;
  billingCycle: string;
  startDate: string;
  endDate: string;
  plan: {
    name?: string;
    slug?: string;
    limits?: unknown;
  } | null;
}

interface OwnerAnalytics {
  summary: AnalyticsSummary;
  ordersByStatus: Record<OrderStatus, number>;
  subscription: AnalyticsSubscription | null;
  period: {
    from: string;
    to: string;
  };
}

interface AnalyticsResponse {
  success: boolean;
  data: OwnerAnalytics;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [DatePipe, DecimalPipe, TitleCasePipe],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly apiUrl = 'http://localhost:5000/api/analytics/owner';

  analytics: OwnerAnalytics | null = null;
  loading = true;
  errorMessage = '';

  readonly statusOrder: OrderStatus[] = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.http
      .get<AnalyticsResponse>(this.apiUrl, {
        withCredentials: true,
      })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          this.analytics = response.data;
          this.cdr.markForCheck();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            error.error?.error?.message ??
            error.error?.message ??
            (error.status === 401
              ? 'Your session has expired. Please sign in again.'
              : 'Could not load analytics. Please try again.');

          this.cdr.markForCheck();
        },
      });
  }

  get statusItems(): { status: OrderStatus; count: number }[] {
    return this.statusOrder.map((status) => ({
      status,
      count: this.analytics?.ordersByStatus?.[status] ?? 0,
    }));
  }

  get totalStatusOrders(): number {
    return this.statusItems.reduce((total, item) => total + item.count, 0);
  }

  getStatusPercentage(count: number): number {
    if (this.totalStatusOrders === 0) {
      return 0;
    }

    return (count / this.totalStatusOrders) * 100;
  }

  get periodLabel(): string {
    if (!this.analytics) {
      return '';
    }

    return new Date(this.analytics.period.from).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }
}
