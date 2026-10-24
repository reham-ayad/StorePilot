
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Store,
  StoreCurrency,
  StoreInput,
  StoreStatus,
  StoresService,
} from '../../../../core/services/stores.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="form-page">
      <a class="back-link" routerLink="/dashboard/stores">
        ← Back to My Stores
      </a>

      <header class="page-header">
        <span class="eyebrow">STORE MANAGEMENT</span>
        <h1>{{ isEditing ? 'Edit Store' : 'Create a Store' }}</h1>
        <p>
          {{
            isEditing
              ? 'Update your store details and preferences.'
              : 'Set up your store and configure its basic preferences.'
          }}
        </p>
      </header>

      @if (errorMessage) {
        <div class="alert" role="alert">{{ errorMessage }}</div>
      }

      @if (loadingStore) {
        <div class="loading">Loading store details...</div>
      } @else {
        <form [formGroup]="storeForm" (ngSubmit)="submit()">
          <section class="form-card">
            <h2>Basic information</h2>
            <p class="section-description">
              Tell us about your store.
            </p>

            <div class="field">
              <label for="name">Store name <span>*</span></label>
              <input
                id="name"
                type="text"
                formControlName="name"
                placeholder="e.g. My Online Shop"
                maxlength="100"
              />
              @if (
                storeForm.controls.name.touched &&
                storeForm.controls.name.invalid
              ) {
                <small class="field-error">
                  Store name is required and must be at least 2 characters.
                </small>
              }
            </div>

            <div class="field">
              <label for="description">Description</label>
              <textarea
                id="description"
                formControlName="description"
                placeholder="Briefly describe your store..."
                rows="4"
                maxlength="1000"
              ></textarea>
              <small class="hint">Maximum 1000 characters.</small>
            </div>

            <div class="field">
              <label for="logoUrl">Logo URL</label>
              <input
                id="logoUrl"
                type="url"
                formControlName="logoUrl"
                placeholder="https://example.com/logo.png"
              />
              @if (
                storeForm.controls.logoUrl.touched &&
                storeForm.controls.logoUrl.invalid
              ) {
                <small class="field-error">
                  Enter a valid URL or leave this field empty.
                </small>
              }
            </div>
          </section>

          <section class="form-card">
            <h2>Regional preferences</h2>
            <p class="section-description">
              Choose the default currency and timezone for your store.
            </p>

            <div class="two-columns">
              <div class="field">
                <label for="currency">Currency</label>
                <select id="currency" formControlName="currency">
                  <option value="EGP">EGP — Egyptian Pound</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="SAR">SAR — Saudi Riyal</option>
                  <option value="AED">AED — UAE Dirham</option>
                </select>
              </div>

              <div class="field">
                <label for="timezone">Timezone</label>
                <select id="timezone" formControlName="timezone">
                  <option value="Africa/Cairo">Africa/Cairo</option>
                  <option value="Asia/Riyadh">Asia/Riyadh</option>
                  <option value="Asia/Dubai">Asia/Dubai</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>

            @if (isEditing) {
              <div class="field">
                <label for="status">Store status</label>
                <select id="status" formControlName="status">
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            }
          </section>

          <div class="form-actions">
            <a class="cancel-button" routerLink="/dashboard/stores">
              Cancel
            </a>

            <button
              class="submit-button"
              type="submit"
              [disabled]="saving"
            >
              {{
                saving
                  ? 'Saving...'
                  : isEditing
                    ? 'Save Changes'
                    : 'Create Store'
              }}
            </button>
          </div>
        </form>
      }
    </section>
  `,
  styles: [`
    :host { display: block; color: #17233d; }

    .form-page { max-width: 850px; margin: 0 auto; padding: 36px; }

    .back-link {
      display: inline-block;
      margin-bottom: 28px;
      color: #5270cc;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
    }

    .eyebrow {
      color: #5273db;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.8px;
    }

    .page-header { margin-bottom: 28px; }
    .page-header h1 { margin: 9px 0; font-size: 32px; letter-spacing: -1px; }
    .page-header p, .section-description { color: #8290a8; font-size: 14px; line-height: 1.7; }

    .form-card {
      margin-bottom: 20px;
      padding: 26px;
      border: 1px solid #e8edf5;
      border-radius: 16px;
      background: #fff;
    }

    .form-card h2 { margin: 0 0 7px; font-size: 18px; }
    .section-description { margin: 0 0 25px; }

    .field { display: flex; flex-direction: column; gap: 9px; margin-bottom: 22px; }
    .field:last-child { margin-bottom: 0; }
    label { color: #34415b; font-size: 13px; font-weight: 700; }
    label span { color: #d44d5a; }

    input, textarea, select {
      box-sizing: border-box;
      width: 100%;
      min-height: 46px;
      padding: 12px 13px;
      border: 1px solid #dfe5ef;
      border-radius: 9px;
      outline: none;
      background: #fff;
      color: #17233d;
      font: inherit;
      font-size: 13px;
      transition: border-color .2s, box-shadow .2s;
    }

    textarea { resize: vertical; }
    input:focus, textarea:focus, select:focus {
      border-color: #6581ed;
      box-shadow: 0 0 0 3px rgb(70 100 220 / 10%);
    }

    .hint { color: #8a96aa; font-size: 11px; }
    .field-error { color: #c33d4b; font-size: 12px; }
    .two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin: 25px 0; }
    .cancel-button, .submit-button {
      display: inline-flex;
      min-height: 44px;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      border: 1px solid #e0e6f0;
      border-radius: 10px;
      background: #fff;
      color: #52617a;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
    }

    .submit-button { border-color: #3659d9; background: #3659d9; color: #fff; }
    .submit-button:hover:not(:disabled) { background: #2848c0; }
    .submit-button:disabled { cursor: not-allowed; opacity: .6; }

    .alert {
      margin-bottom: 20px;
      padding: 14px;
      border-radius: 9px;
      background: #fff0f0;
      color: #b42332;
      font-size: 13px;
    }

    .loading { padding: 35px; color: #8290a8; text-align: center; }

    @media (max-width: 600px) {
      .form-page { padding: 24px 16px; }
      .form-card { padding: 20px; }
      .two-columns { grid-template-columns: 1fr; gap: 0; }
      .page-header h1 { font-size: 27px; }
      .form-actions > * { flex: 1; }
    }
  `],
})
export class StoreForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly storesService = inject(StoresService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
private readonly cdr=inject(ChangeDetectorRef)
  storeId: string | null = null;
  isEditing = false;
  loadingStore = false;
  saving = false;
  errorMessage = '';

  readonly storeForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(1000)]],
    logoUrl: ['', [Validators.pattern(/^$|^https?:\/\/.+/i)]],
    currency: ['EGP' as StoreCurrency, [Validators.required]],
    timezone: ['Africa/Cairo', [Validators.required, Validators.maxLength(100)]],
    status: ['active' as StoreStatus, [Validators.required]],
  });

  ngOnInit(): void {
    this.storeId = this.route.snapshot.paramMap.get('id');
    this.isEditing = Boolean(this.storeId);

    if (this.storeId) {
      this.loadStore(this.storeId);
    }
  }

  private loadStore(id: string): void {
    this.loadingStore = true;
    this.storesService.getStoreById(id).subscribe({
      next: ({ data }) => {
        const store = data.store;

        this.storeForm.patchValue({
          name: store.name,
          description: store.description ?? '',
          logoUrl: store.logoUrl ?? '',
          currency: store.currency,
          timezone: store.timezone,
          status: store.status,

        });

        this.loadingStore = false;
                    this.cdr.markForCheck();

      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage =
          error.error?.error?.message ??
          error.error?.message ??
          'Could not load this store.';
        this.loadingStore = false;
      },
    });
  }

  submit(): void {
    this.errorMessage = '';

    if (this.storeForm.invalid || this.saving) {
      this.storeForm.markAllAsTouched();
      return;
    }

    const value = this.storeForm.getRawValue();

    const input: StoreInput = {
      name: value.name.trim(),
      description: value.description.trim(),
      currency: value.currency,
      timezone: value.timezone.trim(),
    };

    const logoUrl = value.logoUrl.trim();
    if (logoUrl) {
      input.logoUrl = logoUrl;
    } else if (this.isEditing) {
      input.logoUrl = null;
    }

    if (this.isEditing) {
      input.status = value.status;
    }

    this.saving = true;

    const request = this.storeId
      ? this.storesService.updateStore(this.storeId, input)
      : this.storesService.createStore(input);

    request.subscribe({
      next: () => {
        this.saving = false;
        void this.router.navigate(['/dashboard/stores']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage =
          error.error?.error?.message ??
          error.error?.message ??
          (error.status === 0
            ? 'Could not connect to the server. Make sure the backend is running.'
            : 'Could not save this store. Please check your information.');
        this.saving = false;
      },
    });
  }
}
