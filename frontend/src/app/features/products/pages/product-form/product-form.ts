
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Product,
  ProductInput,
  ProductStatus,
  ProductsService,
} from '../../../../core/services/products.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';





@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
private cdr=inject( ChangeDetectorRef);
private snackBar= inject(MatSnackBar)
  storeId = '';
  productId: string | null = null;
  isEditing = false;
  loading = false;
  saving = false;
  errorMessage = '';

  readonly productForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    sku: ['', [
      Validators.required,
      Validators.maxLength(64),
      Validators.pattern(/^[a-zA-Z0-9_-]+$/),
    ]],
    description: ['', [Validators.maxLength(5000)]],
    price: ['0', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    compareAtPrice: [''],
    stock: ['0', [Validators.required, Validators.pattern(/^\d+$/)]],
    imagesText: [''],
    status: ['draft' as ProductStatus, [Validators.required]],
  });

  ngOnInit(): void {
    this.storeId = this.route.snapshot.paramMap.get('storeId') ?? '';
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditing = Boolean(this.productId);

    if (!this.storeId) {
      this.errorMessage = 'Store identifier is missing.';
      return;
    }

    if (this.productId) {
      this.loadProduct(this.productId);
    }
  }

  private loadProduct(id: string): void {
    this.loading = true;

    this.productsService.getProduct(id).subscribe({
      next: ({ data }) => {
        const product: Product = data.product;

        this.productForm.patchValue({
          name: product.name,
          sku: product.sku,
          description: product.description ?? '',
          price: String(product.price),
          compareAtPrice: product.compareAtPrice == null
            ? ''
            : String(product.compareAtPrice),
          stock: String(product.stock),
          imagesText: product.images.join('\n'),
          status: product.status,
        });

        this.loading = false;
                    this.cdr.markForCheck();

      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage =
          error.error?.error?.message ??
          error.error?.message ??
          'Could not load this product.';
        this.loading = false;
      },
    });
  }

  submit(): void {
    this.errorMessage = '';

    if (this.productForm.invalid || this.saving) {
      this.productForm.markAllAsTouched();
      return;
    }

    const value = this.productForm.getRawValue();
    const price = Number(value.price);
    const compareAtPrice = value.compareAtPrice.trim() === ''
      ? null
      : Number(value.compareAtPrice);

    const images = value.imagesText
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      (compareAtPrice !== null &&
        (!Number.isFinite(compareAtPrice) || compareAtPrice < price)) ||
      !Number.isInteger(Number(value.stock)) ||
      Number(value.stock) < 0
    ) {
      this.errorMessage =
        'Check the price, compare-at price, and stock. Compare-at price must be at least the regular price.';
      return;
    }

    if (images.length > 10 || images.some((url) => !this.isValidUrl(url))) {
      this.errorMessage =
        'Enter up to 10 valid image URLs, one per line.';
      return;
    }

    const input: ProductInput = {
      name: value.name.trim(),
      sku: value.sku.trim(),
      description: value.description.trim(),
      price,
      compareAtPrice,
      stock: Number(value.stock),
      images,
      status: value.status,
    };

    this.saving = true;

    const request = this.productId
      ? this.productsService.updateProduct(this.productId, input)
      : this.productsService.createProduct(this.storeId, input);

    request.subscribe({
      next: () => {
        this.saving = false;
        void this.router.navigate([
          '/dashboard/stores',
          this.storeId,
          'products',
        ]);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage =
          error.error?.error?.message ??
          error.error?.message ??
          (error.status === 0
            ? 'Cannot connect to the backend. Check that the server is running.'
            : 'Could not save this product. Check your input and try again.');
        this.saving = false;
      },
    });
  }

  private isValidUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
