
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminDashboardSummary {
  totalUsers: number;
  totalOwners: number;
  totalSuperAdmins: number;
  totalStores: number;
  activeStores: number;
  totalProducts: number;
  totalOrders: number;
  monthlyOrders: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  activePlans: number;
}

export interface AdminDashboardData {
  summary: AdminDashboardSummary;
  ordersByStatus: Record<string, number>;
  period: {
    from: string;
    to: string;
  };
}

interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardData;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5000/api/analytics';

  getAdminDashboard(): Observable<AdminDashboardResponse> {
    return this.http.get<AdminDashboardResponse>(
      `${this.apiUrl}/admin`,
      { withCredentials: true }
    );
  }
}
