
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import {
  Order,
  OrderStatus
} from '../../../../features/orders/order.model';
import { OrdersService } from '../../../../core/services/orders.service';
import { StoresService } from '../../../../core/services/stores.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, DecimalPipe],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss'
})
export class OrderList implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersService = inject(OrdersService);
  private readonly storesService = inject(StoresService);
private cdr=inject( ChangeDetectorRef);

  storeId = '';
  storeName = '';
  storeCurrency = 'EGP';

  orders: Order[] = [];
  loading = true;
  errorMessage = '';

  selectedStatus: OrderStatus | '' = '';
  page = 1;
  readonly limit = 10;
  total = 0;
  totalPages = 0;

  readonly statuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ];

  ngOnInit(): void {
    this.storeId = this.route.snapshot.paramMap.get('storeId') ?? '';

    if (!this.storeId) {
      this.loading = false;
                  this.cdr.markForCheck();

      this.errorMessage = 'Store identifier is missing.';
      return;
    }

    this.storesService.getStoreById(this.storeId).subscribe({
      next: ({ data }) => {
        this.storeName = data.store.name;
        this.storeCurrency = data.store.currency;
      },
      error: () => {
        // The orders request will report access or store errors.
      }
    });

    this.loadOrders();
                      this.cdr.markForCheck();

  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.ordersService
      .getOrders(
        this.storeId,
        this.page,
        this.limit,
        this.selectedStatus
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ data }) => {
          this.orders = data.orders;
          this.page = data.pagination.page;
          this.total = data.pagination.total;
          this.totalPages = data.pagination.pages;
                            this.cdr.markForCheck();


        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            error.error?.error?.message ??
            error.error?.message ??
            'Could not load orders. Please try again.';
        }
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadOrders();
                      this.cdr.markForCheck();

  }

  resetFilters(): void {
    this.selectedStatus = '';
    this.page = 1;
    this.loadOrders();
  }

  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.page
    ) {
      return;
    }

    this.page = page;
    this.loadOrders();
  }

  getStatusClass(status: OrderStatus): string {
    return `status-${status}`;
  }
}
