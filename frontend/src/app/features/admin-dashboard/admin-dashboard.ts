
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AdminDashboardData,
  AnalyticsService
} from '../../core/services/analytics.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);

  dashboard: AdminDashboardData | null = null;
  loading = true;
  errorMessage = '';

  readonly statusOrder = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ];

  readonly statusLabels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.analyticsService.getAdminDashboard().subscribe({
      next: (response) => {
        this.dashboard = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 401) {
          this.errorMessage = 'Your session has expired. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage =
            'Access denied. This page is available to Super Admins only.';
        } else {
          this.errorMessage =
            'Unable to load dashboard data. Please try again.';
        }
      }
    });
  }

  get totalStatusOrders(): number {
    if (!this.dashboard) return 0;

    return Object.values(this.dashboard.ordersByStatus).reduce(
      (total, count) => total + count,
      0
    );
  }

  getStatusPercentage(status: string): number {
    if (!this.dashboard || this.totalStatusOrders === 0) return 0;

    return Math.round(
      ((this.dashboard.ordersByStatus[status] ?? 0) /
        this.totalStatusOrders) *
        100
    );
  }

  getStatusCount(status: string): number {
    return this.dashboard?.ordersByStatus[status] ?? 0;
  }

  get currentMonthLabel(): string {
    return new Intl.DateTimeFormat('en', {
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  }
}
