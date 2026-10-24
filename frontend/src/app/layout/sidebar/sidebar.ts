
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
      <a class="brand" routerLink="/dashboard">
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
          <span class="nav-icon">▦</span>
          <span>Overview</span>
        </a>

        <a
          routerLink="/dashboard/stores"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="nav-link"
        >
          <span class="nav-icon">▣</span>
          <span>My Stores</span>
        </a>

        <a
          href="#"
          (click)="openProducts($event)"
          [class.active]="isProductsActive"
          class="nav-link"
        >
          <span class="nav-icon">◇</span>
          <span>Products</span>
        </a>

        <a class="nav-link disabled" aria-disabled="true">
          <span class="nav-icon">▤</span>
          <span>Orders</span>
          <span class="soon">Soon</span>
        </a>

        <a class="nav-link disabled" aria-disabled="true">
          <span class="nav-icon">▥</span>
          <span>Analytics</span>
          <span class="soon">Soon</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="footer-mark">SP</div>
        <div>
          <strong>StorePilot</strong>
          <p>Business workspace</p>
        </div>
      </div>
    </aside>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .sidebar {
        position: fixed;
        inset: 0 auto 0 0;
        z-index: 20;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        width: 250px;
        padding: 26px 17px 18px;
        border-right: 1px solid #e8ecf3;
        background: #fff;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 8px 34px;
        color: #172033;
        font-size: 21px;
        font-weight: 800;
        text-decoration: none;
        letter-spacing: -0.6px;
      }

      .brand-icon {
        display: grid;
        place-items: center;
        width: 38px;
        height: 38px;
        flex-shrink: 0;
        border-radius: 11px;
        background: #3157d5;
        color: #fff;
      }

      .section-label {
        margin: 0 10px 12px;
        color: #9aa3b4;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.4px;
      }

      .nav-list {
        display: grid;
        gap: 6px;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 44px;
        box-sizing: border-box;
        padding: 0 12px;
        border-radius: 9px;
        color: #69758b;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        transition: background 0.2s, color 0.2s;
        cursor: pointer;
      }

      .nav-link:hover {
        background: #f5f7fc;
        color: #3157d5;
      }

      .nav-link.active {
        background: #edf1ff;
        color: #3157d5;
      }

      .nav-icon {
        display: grid;
        place-items: center;
        width: 22px;
        flex-shrink: 0;
        font-size: 19px;
      }

      .disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      .disabled:hover {
        background: transparent;
        color: #69758b;
      }

      .soon {
        margin-left: auto;
        color: #929bad;
        font-size: 10px;
      }

      .sidebar-footer {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: auto;
        padding: 18px 7px 5px;
        border-top: 1px solid #edf0f5;
      }

      .footer-mark {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        flex-shrink: 0;
        border-radius: 9px;
        background: #f0f3ff;
        color: #3157d5;
        font-size: 11px;
        font-weight: 800;
      }

      .sidebar-footer strong {
        font-size: 12px;
      }

      .sidebar-footer p {
        margin: 4px 0 0;
        color: #929bad;
        font-size: 11px;
      }

      @media (max-width: 760px) {
        .sidebar {
          inset: 0 0 auto;
          flex-direction: row;
          align-items: center;
          width: 100%;
          height: 68px;
          padding: 10px 14px;
          border-right: 0;
          border-bottom: 1px solid #e8ecf3;
        }

        .brand {
          padding: 0;
          font-size: 18px;
        }

        .brand-icon {
          width: 34px;
          height: 34px;
        }

        .section-label,
        .nav-list,
        .sidebar-footer {
          display: none;
        }
      }
    `,
  ],
})
export class Sidebar implements OnInit, OnDestroy {
  private readonly storesService = inject(StoresService);
  private readonly router = inject(Router);

  private routerSubscription?: Subscription;

  isProductsActive = false;

  ngOnInit(): void {
    this.updateActiveLink();

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateActiveLink());
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  private updateActiveLink(): void {
    this.isProductsActive =
      /^\/dashboard\/stores\/[^/]+\/products(?:\/|$)/.test(
        this.router.url,
      );
  }

  openProducts(event: Event): void {
    event.preventDefault();

    this.storesService.getMyStores(1, 1).subscribe({
      next: (response) => {
        const store = response.data.stores[0];

        if (!store) {
          this.router.navigate(['/dashboard/stores/new']);
          return;
        }

        this.router.navigate([
          '/dashboard/stores',
          store._id,
          'products',
        ]);
      },
      error: (error) => {
        console.error('Failed to load stores:', error);
      },
    });
  }
}
