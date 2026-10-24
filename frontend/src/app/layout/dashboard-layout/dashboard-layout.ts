
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  template: `
    <div class="app-shell">
      <app-sidebar />

      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .app-shell {
      min-height: 100vh;
      background: #f6f8fc;
    }

    .main-content {
      min-width: 0;
      margin-left: 250px;
      min-height: 100vh;
    }

    @media (max-width: 760px) {
      .main-content {
        margin-left: 0;
        padding-top: 68px;
      }
    }
  `],
})
export class DashboardLayout {}
