
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { filter, Subscription } from 'rxjs';
import { StoresService } from '../../core/services/stores.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <a class="brand" routerLink="/dashboard" aria-label="StorePilot home">
        <span class="brand-icon">S</span>
        <span>StorePilot</span>
      </a>

      <p class="section-label">WORKSPACE</p>

      <nav class="nav-list" aria-label="Main navigation">
        <a
          routerLink="/dashboard"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="nav-link"
        >
          <span class="nav-icon">
            <i class="fa-solid fa-gauge-high"></i>
          </span>
          <span>Overview</span>
        </a>

        <a
          routerLink="/dashboard/stores"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="nav-link"
        >
          <span class="nav-icon">
            <i class="fa-solid fa-store"></i>
          </span>
          <span>My Stores</span>
        </a>

        <a
          href="#"
          (click)="openProducts($event)"
          [class.active]="isProductsActive"
          class="nav-link"
        >
          <span class="nav-icon">
            <i class="fa-solid fa-boxes-stacked"></i>
          </span>
          <span>Products</span>
          <span class="nav-arrow">›</span>
        </a>

        <a
          href="#"
          (click)="openOrders($event)"
          [class.active]="isOrdersActive"
          class="nav-link"
        >
          <span class="nav-icon">
            <i class="fa-solid fa-receipt"></i>
          </span>
          <span>Orders</span>
          <span class="nav-arrow">›</span>
        </a>

        <a
          routerLink="/dashboard/analytics"
          routerLinkActive="active"
          class="nav-link"
        >
          <span class="nav-icon">
            <i class="fa-solid fa-chart-line"></i>
          </span>
          <span>Analytics</span>
        </a>
      </nav>

      <div class="sidebar-note">
        <span class="note-icon">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </span>

        <div>
          <strong>Your business, organized.</strong>
          <p>Everything in one place.</p>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="footer-mark">SP</div>

        <div class="footer-info">
          <strong>StorePilot</strong>
          <p>Business workspace</p>
        </div>

        <span class="footer-status" title="Workspace"></span>
      </div>
    </aside>
  `,
  styles: [
    `
      :host {
        --brown: #70513b;
        --dark-brown: #3e2c22;
        --muted: #806e60;
        --border: #e9dfd3;
        --cream: #f8f5ef;
        --surface: #fffdfa;
        --brown-light: #f0e6d6;
        --brown-soft: #f7f0e7;

        display: block;
        font-family: 'DM Sans', Arial, sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      .sidebar {
        position: fixed;
        inset: 0 auto 0 0;
        z-index: 20;

        display: flex;
        flex-direction: column;

        width: 250px;
        height: 100vh;
        height: 100dvh;
        padding: 27px 16px 18px;

        border-right: 1px solid var(--border);
        background: var(--surface);
        color: var(--dark-brown);

        box-shadow: 4px 0 20px rgb(62 44 34 / 2%);
      }

      /* Brand */

      .brand {
        display: flex;
        align-items: center;
        gap: 11px;

        padding: 0 8px 31px;

        color: var(--dark-brown);
        font-size: 21px;
        font-weight: 750;
        letter-spacing: -0.6px;
        text-decoration: none;
      }

      .brand-icon {
        display: grid;
        place-items: center;
        flex-shrink: 0;

        width: 40px;
        height: 40px;

        border-radius: 12px;
        background: var(--brown);
        color: #fffdfa;

        font-size: 22px;
        font-weight: 750;

        box-shadow: 0 4px 10px rgb(112 81 59 / 16%);
      }

      /* Section label */

      .section-label {
        margin: 0 11px 12px;

        color: #a08d7b;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.5px;
      }

      /* Navigation */

      .nav-list {
        display: grid;
        gap: 6px;
      }

      .nav-link {
        position: relative;

        display: flex;
        align-items: center;
        gap: 12px;

        min-height: 46px;
        padding: 0 12px;

        border: 1px solid transparent;
        border-radius: 10px;

        color: var(--muted);
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;

        cursor: pointer;

        transition:
          background-color 150ms ease-out,
          color 150ms ease-out,
          border-color 150ms ease-out;
      }

      .nav-link:hover {
        background: var(--brown-soft);
        color: var(--brown);
      }

      .nav-link:focus-visible {
        outline: 2px solid var(--brown);
        outline-offset: 2px;
      }

      .nav-link.active {
        border-color: #e8d9c8;
        background: var(--brown-light);
        color: var(--brown);
        font-weight: 750;
      }

      .nav-link.active::before {
        position: absolute;
        top: 10px;
        bottom: 10px;
        left: -1px;

        width: 3px;
        border-radius: 0 4px 4px 0;
        background: var(--brown);

        content: '';
      }

      .nav-icon {
        display: grid;
        place-items: center;
        flex: 0 0 23px;

        width: 23px;
        height: 23px;

        color: inherit;
      }

      .nav-icon i {
        font-size: 16px;
        line-height: 1;
      }

      .nav-arrow {
        margin-left: auto;

        color: #a08d7b;
        font-size: 18px;
        line-height: 1;

        opacity: 0;
        transition: opacity 150ms ease-out;
      }

      .nav-link:hover .nav-arrow,
      .nav-link.active .nav-arrow {
        opacity: 1;
      }

      /* Sidebar helper card */

      .sidebar-note {
        display: flex;
        align-items: flex-start;
        gap: 10px;

        margin-top: auto;
        margin-bottom: 18px;
        padding: 14px 11px;

        border: 1px solid var(--border);
        border-radius: 12px;

        background: linear-gradient(
          135deg,
          var(--brown-soft),
          var(--surface)
        );
      }

      .note-icon {
        display: grid;
        place-items: center;
        flex-shrink: 0;

        width: 29px;
        height: 29px;

        border-radius: 9px;
        background: var(--brown-light);
        color: var(--brown);

        font-size: 13px;
      }

      .sidebar-note strong {
        display: block;
        margin: 1px 0 5px;

        color: var(--dark-brown);
        font-size: 10px;
        font-weight: 750;
        line-height: 1.5;
      }

      .sidebar-note p {
        margin: 0;

        color: var(--muted);
        font-size: 10px;
        line-height: 1.5;
      }

      /* Footer */

      .sidebar-footer {
        display: flex;
        align-items: center;
        gap: 10px;

        padding: 17px 7px 4px;
        border-top: 1px solid var(--border);
      }

      .footer-mark {
        display: grid;
        place-items: center;
        flex-shrink: 0;

        width: 37px;
        height: 37px;

        border: 1px solid #e5d5c2;
        border-radius: 10px;
        background: var(--brown-light);
        color: var(--brown);

        font-size: 11px;
        font-weight: 800;
      }

      .footer-info {
        min-width: 0;
      }

      .sidebar-footer strong {
        display: block;

        color: var(--dark-brown);
        font-size: 12px;
        font-weight: 750;
      }

      .sidebar-footer p {
        margin: 4px 0 0;

        color: var(--muted);
        font-size: 10px;
      }

      .footer-status {
        flex-shrink: 0;

        width: 7px;
        height: 7px;
        margin-left: auto;

        border-radius: 50%;
        background: #78916b;
      }

      /* Tablet and mobile */

      @media (max-width: 760px) {
        .sidebar {
          inset: 0 0 auto;

          flex-direction: row;
          align-items: center;

          width: 100%;
          height: 68px;
          padding: 10px 17px;

          border-right: 0;
          border-bottom: 1px solid var(--border);

          box-shadow: 0 4px 15px rgb(62 44 34 / 4%);
        }

        .brand {
          gap: 9px;
          padding: 0;
          font-size: 18px;
        }

        .brand-icon {
          width: 35px;
          height: 35px;
          border-radius: 10px;
          font-size: 19px;
        }

        .section-label,
        .nav-list,
        .sidebar-note,
        .sidebar-footer {
          display: none;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          transition: none !important;
        }
      }
    `,
  ],
})
export class Sidebar implements OnInit, OnDestroy {
  private readonly storesService = inject(StoresService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  private routerSubscription?: Subscription;
  private storeRequestSubscription?: Subscription;

  private storeId?: string;
  private storesLoading = false;
  private pendingSection?: 'products' | 'orders';

  isProductsActive = false;
  isOrdersActive = false;

  ngOnInit(): void {
    this.updateActiveLink();

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveLink();
        this.cdr.markForCheck();
      });

    // Load the user's stores early so navigation can be faster.
    this.preloadStores();
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.storeRequestSubscription?.unsubscribe();
  }

  private updateActiveLink(): void {
    const currentUrl = this.router.url.split('?')[0].split('#')[0];

    this.isProductsActive =
      /^\/dashboard\/stores\/[^/]+\/products(?:\/|$)/.test(currentUrl);

    this.isOrdersActive =
      /^\/dashboard\/stores\/[^/]+\/orders(?:\/|$)/.test(currentUrl);
  }

  private preloadStores(): void {
    if (this.storesLoading || this.storeId) {
      return;
    }

    this.storesLoading = true;

    this.storeRequestSubscription = this.storesService
      .getMyStores(1, 1)
      .subscribe({
        next: ({ data }) => {
          this.storeId = data.stores[0]?._id;
          this.storesLoading = false;

          if (this.pendingSection) {
            const section = this.pendingSection;
            this.pendingSection = undefined;
            this.openStoreSection(section);
          }

          this.cdr.markForCheck();
        },
        error: (error) => {
          this.storesLoading = false;

          console.error('Failed to preload stores:', error);
          this.cdr.markForCheck();
        },
      });
  }

  openProducts(event: Event): void {
    event.preventDefault();
    this.openStoreSection('products');
  }

  openOrders(event: Event): void {
    event.preventDefault();
    this.openStoreSection('orders');
  }

  private openStoreSection(section: 'products' | 'orders'): void {
    // Navigate immediately when the store ID is already available.
    if (this.storeId) {
      void this.router.navigate([
        '/dashboard/stores',
        this.storeId,
        section,
      ]);
      return;
    }

    // Wait for the existing preload request instead of starting another.
    if (this.storesLoading) {
      this.pendingSection = section;
      return;
    }

    // Retry if the preload request failed.
    this.pendingSection = section;
    this.preloadStores();
  }
}
