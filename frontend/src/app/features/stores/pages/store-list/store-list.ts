
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoresService, Store } from '../../../../core/services/stores.service';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './store-list.html',
  styleUrl: './store-list.scss',
})
export class StoreList implements OnInit {
  private readonly storesService = inject(StoresService);
private cdr=inject( ChangeDetectorRef);
  stores: Store[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';
  archivingId: string | null = null;

  page = 1;
  limit = 9;
  total = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores(): void {
    this.loading = true;
    this.errorMessage = '';

    this.storesService.getMyStores(this.page, this.limit).subscribe({
      next: (response) => {
        this.stores = response.data.stores;
        this.page = response.data.pagination.page;
        this.total = response.data.pagination.total;
        this.totalPages = response.data.pagination.totalPages;
        this.loading = false;
            this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage =
          error.error?.error?.message ??
          error.error?.message ??
          'Could not load your stores. Please try again.';
        this.loading = false;
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.page) {
      return;
    }

    this.page = page;
    this.loadStores();
  }

  archiveStore(store: Store): void {
    const confirmed = window.confirm(
      `Archive "${store.name}"? It will no longer appear in your active stores.`,
    );

    if (!confirmed || this.archivingId) {
      return;
    }

    this.archivingId = store._id;
    this.errorMessage = '';
    this.successMessage = '';

    this.storesService.archiveStore(store._id).subscribe({
      next: (response) => {
        this.successMessage = response.data.message;

        // Refresh the current page. If its last store was archived,
        // move back one page when possible.
        if (this.stores.length === 1 && this.page > 1) {
          this.page--;
        }

        this.archivingId = null;
        this.loadStores();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage =
          error.error?.error?.message ??
          error.error?.message ??
          'Could not archive this store. Please try again.';
        this.archivingId = null;
      },
    });
  }

  trackByStoreId(_index: number, store: Store): string {
    return store._id;
  }
}
