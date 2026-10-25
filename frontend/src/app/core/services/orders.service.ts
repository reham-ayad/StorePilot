
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Order,
  OrderResponse,
  OrderStatus,
  OrdersResponse
} from '../../features/orders/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api';

  getOrders(
    storeId: string,
    page = 1,
    limit = 10,
    status?: OrderStatus | ''
  ): Observable<OrdersResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<OrdersResponse>(
      `${this.apiUrl}/stores/${storeId}/orders`,
      { params }
    );
  }

  getOrderById(
    storeId: string,
    orderId: string
  ): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(
      `${this.apiUrl}/stores/${storeId}/orders/${orderId}`
    );
  }

  updateOrderStatus(
    storeId: string,
    orderId: string,
    status: OrderStatus
  ): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(
      `${this.apiUrl}/stores/${storeId}/orders/${orderId}/status`,
      { status }
    );
  }
}
