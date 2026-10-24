
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { StoresService } from '../../../../core/services/stores.service';
import {
  Product,
  ProductStatus,
  ProductsService,
} from '../../../../core/services/products.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly storesService = inject(StoresService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  storeId = '';
  storeName = '';
  storeCurrency = 'EGP';

  products: Product[] = [];

  loading = true;
  errorMessage = '';
  successMessage = '';
  archivingId: string | null = null;

  search = '';
  selectedStatus = '';

  page = 1;
  readonly limit = 9;
  total = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const storeId = params.get('storeId') ?? '';

        if (!storeId) {
          this.storeId = '';
          this.products = [];
          this.loading = false;
          this.errorMessage = 'Store identifier is missing.';
          this.cdr.markForCheck();
          return;
        }

        this.storeId = storeId;
        this.page = 1;
        this.search = '';
        this.selectedStatus = '';
        this.storeName = '';
        this.products = [];
        this.total = 0;
        this.totalPages = 0;

        this.loadStoreDetails();
        this.loadProducts();
      });
  }

  private loadStoreDetails(): void {
    this.storesService
      .getStoreById(this.storeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ data }) => {
          this.storeName = data.store.name;
          this.storeCurrency = data.store.currency;
          this.cdr.markForCheck();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to load store details:', error);
          this.cdr.markForCheck();
        },
      });
  }

  loadProducts(): void {
    if (!this.storeId) {
      this.loading = false;
      this.errorMessage = 'Store identifier is missing.';
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.productsService
      .getProducts(
        this.storeId,
        this.page,
        this.limit,
        this.search,
        this.selectedStatus,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Products API response:', response);

          this.products = response.data.products;
          this.page = response.data.pagination.page;
          this.total = response.data.pagination.total;
          this.totalPages = response.data.pagination.totalPages;

          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to load products:', error);

          this.products = [];
          this.errorMessage =
            error.error?.error?.message ??
            error.error?.message ??
            'Could not load products. Please try again.';

          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadProducts();
  }

  resetFilters(): void {
    this.search = '';
    this.selectedStatus = '';
    this.page = 1;
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.page ||
      this.loading
    ) {
      return;
    }

    this.page = page;
    this.loadProducts();
  }

  archiveProduct(product: Product): void {
    if (!window.confirm(`Archive "${product.name}"?`)) {
      return;
    }

    this.archivingId = product._id;
    this.errorMessage = '';
    this.successMessage = '';

    this.productsService
      .archiveProduct(product._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ data }) => {
          this.successMessage = data.message;

          if (this.products.length === 1 && this.page > 1) {
            this.page--;
          }

          this.archivingId = null;
          this.loadProducts();
          this.cdr.markForCheck();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to archive product:', error);

          this.errorMessage =
            error.error?.error?.message ??
            error.error?.message ??
            'Could not archive this product.';

          this.archivingId = null;
          this.cdr.markForCheck();
        },
      });
  }

  getStatusClass(status: ProductStatus): string {
    return `status-${status}`;
  }
}
