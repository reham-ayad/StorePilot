
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  StoreCurrency,
  StoreInput,
  StoreStatus,
  StoresService,
} from '../../../../core/services/stores.service';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="form-page">
      <a class="back-link" routerLink="/dashboard/stores">
        <span aria-hidden="true">←</span>
        Back to My Stores
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
        <div class="alert" role="alert">
          <span>{{ errorMessage }}</span>
          <button
            type="button"
            class="alert-dismiss"
            aria-label="Dismiss error"
            (click)="errorMessage = ''"
          >
            ×
          </button>
        </div>
      }

      @if (loadingStore) {
        <div class="loading-card" role="status">
          <span class="loader"></span>
          <p>Loading store details...</p>
        </div>
      } @else {
        <form [formGroup]="storeForm" (ngSubmit)="submit()">
          <section class="form-card">
            <div class="section-heading">
              <div class="section-icon" aria-hidden="true">▤</div>
              <div>
                <h2>Basic information</h2>
                <p class="section-description">
                  Tell us about your store.
                </p>
              </div>
            </div>

            <div class="field">
              <label for="name">
                Store name <span class="required">*</span>
              </label>

              <input
                id="name"
                type="text"
                formControlName="name"
                placeholder="e.g. My Online Shop"
                maxlength="100"
                autocomplete="organization"
                [class.invalid]="
                  storeForm.controls.name.touched &&
                  storeForm.controls.name.invalid
                "
              />

              @if (
                storeForm.controls.name.touched &&
                storeForm.controls.name.invalid
              ) {
                <small class="field-error">
                  Store name is required and must be between 2 and 100
                  characters.
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

              <small class="hint">
                Maximum 1000 characters.
              </small>
            </div>

            <div class="field">
              <label for="logoUrl">Logo URL</label>

              <input
                id="logoUrl"
                type="url"
                formControlName="logoUrl"
                placeholder="https://example.com/logo.png"
                [class.invalid]="
                  storeForm.controls.logoUrl.touched &&
                  storeForm.controls.logoUrl.invalid
                "
              />

              @if (
                storeForm.controls.logoUrl.touched &&
                storeForm.controls.logoUrl.invalid
              ) {
                <small class="field-error">
                  Enter a valid HTTP or HTTPS URL, or leave this field empty.
                </small>
              } @else {
                <small class="hint">
                  Optional. Use a publicly accessible image URL.
                </small>
              }
            </div>
          </section>

          <section class="form-card">
            <div class="section-heading">
              <div class="section-icon" aria-hidden="true">◎</div>
              <div>
                <h2>Regional preferences</h2>
                <p class="section-description">
                  Choose the default currency and timezone for your store.
                </p>
              </div>
            </div>

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
              <div class="field status-field">
                <label for="status">Store status</label>

                <select id="status" formControlName="status">
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>

                <small class="hint">
                  Pausing a store may affect its availability to customers.
                </small>
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
              @if (saving) {
                <span class="button-loader"></span>
                Saving...
              } @else {
                {{ isEditing ? 'Save Changes' : 'Create Store' }}
              }
            </button>
          </div>
        </form>
      }
    </section>
  `,
  styles: [`
    :host {
      display: block;
      color: #3e2c22;
      font-family: 'DM Sans', Arial, sans-serif;
    }

    .form-page {
      box-sizing: border-box;
      max-width: 850px;
      margin: 0 auto;
      padding: 36px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 28px;
      color: #70513b;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #3e2c22;
      }

      &:focus-visible {
        outline: 3px solid rgb(112 81 59 / 20%);
        outline-offset: 4px;
        border-radius: 3px;
      }

      span {
        font-size: 18px;
      }
    }

    .page-header {
      margin-bottom: 28px;

      h1 {
        margin: 9px 0;
        color: #3e2c22;
        font-size: clamp(27px, 3vw, 32px);
        font-weight: 800;
        letter-spacing: -1px;
      }

      p {
        margin: 0;
        color: #806e60;
        font-size: 14px;
        line-height: 1.7;
      }
    }

    .eyebrow {
      color: #70513b;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.8px;
    }

    .form-card {
      padding: 26px;
      margin-bottom: 20px;
      border: 1px solid #e9dfd3;
      border-radius: 16px;
      background: #fffdfa;
      box-shadow: 0 4px 18px rgb(62 44 34 / 3%);
    }

    .section-heading {
      display: flex;
      align-items: center;
      gap: 13px;
      margin-bottom: 25px;

      h2 {
        margin: 0 0 6px;
        color: #3e2c22;
        font-size: 18px;
        font-weight: 750;
      }
    }

    .section-icon {
      display: grid;
      width: 42px;
      height: 42px;
      flex-shrink: 0;
      place-items: center;
      border: 1px solid #e9dfd3;
      border-radius: 12px;
      background: #f0e6d6;
      color: #70513b;
      font-size: 21px;
    }

    .section-description {
      margin: 0;
      color: #806e60;
      font-size: 13px;
      line-height: 1.6;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 9px;
      margin-bottom: 22px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    label {
      color: #5d4737;
      font-size: 13px;
      font-weight: 700;
    }

    .required {
      color: #b42332;
    }

    input,
    textarea,
    select {
      box-sizing: border-box;
      width: 100%;
      min-height: 46px;
      padding: 12px 13px;
      border: 1px solid #e3d4c4;
      border-radius: 9px;
      outline: none;
      background: #fffdfa;
      color: #3e2c22;
      font: inherit;
      font-size: 13px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease,
        background 0.2s ease;

      &::placeholder {
        color: #b0a092;
      }

      &:hover:not(:disabled) {
        border-color: #cbb39c;
      }

      &:focus {
        border-color: #70513b;
        box-shadow: 0 0 0 3px rgb(112 81 59 / 12%);
      }

      &.invalid {
        border-color: #c64a52;
      }

      &.invalid:focus {
        box-shadow: 0 0 0 3px rgb(196 74 82 / 10%);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.65;
      }
    }

    textarea {
      min-height: 110px;
      resize: vertical;
      line-height: 1.7;
    }

    .hint {
      color: #948274;
      font-size: 11px;
      line-height: 1.5;
    }

    .field-error {
      color: #b42332;
      font-size: 12px;
      line-height: 1.5;
    }

    .two-columns {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }

    .status-field {
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin: 25px 0;
    }

    .cancel-button,
    .submit-button {
      box-sizing: border-box;
      display: inline-flex;
      min-height: 44px;
      align-items: center;
      justify-content: center;
      gap: 9px;
      padding: 0 20px;
      border: 1px solid #e3d4c4;
      border-radius: 10px;
      background: #fffdfa;
      color: #5d4737;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease,
        color 0.2s ease, transform 0.2s ease;

      &:focus-visible {
        outline: 3px solid rgb(112 81 59 / 20%);
        outline-offset: 3px;
      }
    }

    .cancel-button:hover {
      border-color: #d9c5b0;
      background: #f7f0e7;
    }

    .submit-button {
      min-width: 145px;
      border-color: #70513b;
      background: #70513b;
      color: #fffdfa;

      &:hover:not(:disabled) {
        border-color: #3e2c22;
        background: #3e2c22;
        transform: translateY(-1px);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.65;
      }
    }

    .button-loader {
      width: 14px;
      height: 14px;
      border: 2px solid rgb(255 253 250 / 40%);
      border-top-color: #fffdfa;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .alert {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 20px;
      padding: 14px 16px;
      border: 1px solid #f3cbd0;
      border-radius: 10px;
      background: #fff0f1;
      color: #a61b2b;
      font-size: 13px;
      line-height: 1.6;
    }

    .alert-dismiss {
      flex-shrink: 0;
      padding: 0 4px;
      border: 0;
      background: transparent;
      color: inherit;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
    }

    .loading-card {
      display: flex;
      min-height: 220px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      border: 1px solid #e9dfd3;
      border-radius: 16px;
      background: #fffdfa;

      p {
        margin: 0;
        color: #806e60;
        font-size: 13px;
      }
    }

    .loader {
      width: 30px;
      height: 30px;
      border: 3px solid #e9dfd3;
      border-top-color: #70513b;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 760px) {
      .form-page {
        padding: 26px 20px;
      }
    }

    @media (max-width: 600px) {
      .form-page {
        padding: 22px 16px;
      }

      .form-card {
        padding: 20px 16px;
      }

      .two-columns {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .form-actions > * {
        width: 100%;
      }

      .submit-button {
        min-height: 46px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
      }
    }
  `],
})
export class StoreForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly storesService = inject(StoresService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  storeId: string | null = null;
  isEditing = false;
  loadingStore = false;
  saving = false;
  errorMessage = '';

  readonly storeForm = this.fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ],
    ],
    description: ['', [Validators.maxLength(1000)]],
    logoUrl: ['', [Validators.pattern(/^$|^https?:\/\/.+/i)]],
    currency: ['EGP' as StoreCurrency, [Validators.required]],
    timezone: [
      'Africa/Cairo',
      [Validators.required, Validators.maxLength(100)],
    ],
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
    this.errorMessage = '';
    this.cdr.markForCheck();

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
          'Could not load this store. Please try again.';

        this.loadingStore = false;
        this.cdr.markForCheck();
      },
    });
  }

  submit(): void {
    this.errorMessage = '';

    if (this.storeForm.invalid || this.saving) {
      this.storeForm.markAllAsTouched();
      this.cdr.markForCheck();
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
    this.cdr.markForCheck();

    const request =
      this.storeId && this.isEditing
        ? this.storesService.updateStore(this.storeId, input)
        : this.storesService.createStore(input);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.cdr.markForCheck();

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
        this.cdr.markForCheck();
      },
    });
  }
}
