
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface Product {
  _id: string;
  store: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  images: string[];
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name?: string;
  sku?: string;
  price?: number;
  description?: string;
  compareAtPrice?: number | null;
  stock?: number;
  images?: string[];
  status?: ProductStatus;
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: ProductPagination;
  };
}

export interface ProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

export interface ArchiveProductResponse {
  success: boolean;
  data: {
    message: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api';

  getProducts(
    storeId: string,
    page = 1,
    limit = 9,
    search = '',
    status = '',
  ): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    const normalizedSearch = search.trim();

    if (normalizedSearch) {
      params = params.set('search', normalizedSearch);
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ProductsResponse>(
      `${this.apiUrl}/stores/${encodeURIComponent(storeId)}/products`,
      { params },
    );
  }

  getProduct(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.apiUrl}/products/${encodeURIComponent(id)}`,
    );
  }

  createProduct(
    storeId: string,
    input: ProductInput,
  ): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(
      `${this.apiUrl}/stores/${encodeURIComponent(storeId)}/products`,
      input,
    );
  }

  updateProduct(
    id: string,
    input: ProductInput,
  ): Observable<ProductResponse> {
    return this.http.patch<ProductResponse>(
      `${this.apiUrl}/products/${encodeURIComponent(id)}`,
      input,
    );
  }

  archiveProduct(id: string): Observable<ArchiveProductResponse> {
    return this.http.delete<ArchiveProductResponse>(
      `${this.apiUrl}/products/${encodeURIComponent(id)}`,
    );
  }
}
