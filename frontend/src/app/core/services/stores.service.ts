
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type StoreStatus = 'active' | 'paused';
export type StoreCurrency = 'EGP' | 'USD' | 'EUR' | 'SAR' | 'AED';

export interface Store {
  _id: string;
  name: string;
  description: string;
  logoUrl: string | null;
  currency: StoreCurrency;
  timezone: string;
  status: StoreStatus;
  owner: string;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoreInput {
  name: string;
  description?: string;
  logoUrl?: string | null;
  currency?: StoreCurrency;
  timezone?: string;
  status?: StoreStatus;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StoresResponse {
  success: boolean;
  data: {
    stores: Store[];
    pagination: Pagination;
  };
}

export interface StoreResponse {
  success: boolean;
  data: {
    store: Store;
  };
}

export interface ArchiveStoreResponse {
  success: boolean;
  data: {
    message: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class StoresService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/stores';

  getMyStores(page = 1, limit = 10): Observable<StoresResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    return this.http.get<StoresResponse>(this.apiUrl, { params });
  }

  getStoreById(id: string): Observable<StoreResponse> {
    return this.http.get<StoreResponse>(`${this.apiUrl}/${id}`);
  }

  createStore(input: StoreInput): Observable<StoreResponse> {
    return this.http.post<StoreResponse>(this.apiUrl, input);
  }

  updateStore(
    id: string,
    input: StoreInput,
  ): Observable<StoreResponse> {
    return this.http.patch<StoreResponse>(
      `${this.apiUrl}/${id}`,
      input,
    );
  }

  archiveStore(id: string): Observable<ArchiveStoreResponse> {
    return this.http.delete<ArchiveStoreResponse>(
      `${this.apiUrl}/${id}`,
    );
  }
}
