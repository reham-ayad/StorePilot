
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Order, OrderStatus } from '../../../../features/orders/order.model';
import { OrdersService } from '../../../../core/services/orders.service';


import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, TitleCasePipe],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss'
})
export class OrderDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersService = inject(OrdersService);
         
private cdr=inject( ChangeDetectorRef);
  storeId = '';
  orderId = '';
  order: Order | null = null;

  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';

  readonly allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: []
  };

  ngOnInit(): void {
    this.storeId = this.route.snapshot.paramMap.get('storeId') ?? '';
    this.orderId = this.route.snapshot.paramMap.get('orderId') ?? '';

    if (!this.storeId || !this.orderId) {
      this.loading = false;
      this.errorMessage = 'Store or order identifier is missing.';
      return;
    }

    this.loadOrder();
  }

  loadOrder(): void {
    this.loading = true;
    this.errorMessage = '';

    this.ordersService
      .getOrderById(this.storeId, this.orderId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ data }) => {
          this.order = data.order;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            error.error?.error?.message ??
            error.error?.message ??
            'Could not load order details.';
                     this.cdr.markForCheck();

        }
      });
  }

  get nextStatuses(): OrderStatus[] {
    if (!this.order) return [];
    return this.allowedTransitions[this.order.status];
  }

  updateStatus(status: OrderStatus): void {
    if (!this.order || this.saving) return;

    if (
      status === 'cancelled' &&
      !window.confirm(
        'Cancel this order? Its product quantities will be returned to stock.'
      )
    ) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.ordersService
      .updateOrderStatus(this.storeId, this.order._id, status)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: ({ data }) => {
          this.order = data.order;
          this.successMessage = `Order status updated to ${status}.`;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            error.error?.error?.message ??
            error.error?.message ??
            'Could not update order status.';
        }
      });
  }

  getStatusClass(status: OrderStatus): string {
    return `status-${status}`;
  }
}
