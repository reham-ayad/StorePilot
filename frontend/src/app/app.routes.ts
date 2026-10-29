
import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Home } from './features/home/home';

import { Overview } from './features/dashboard/pages/overview/overview';
import { StoreList } from './features/stores/pages/store-list/store-list';
import { StoreForm } from './features/stores/pages/store-form/store-form';

import { ProductList } from './features/products/pages/product-list/product-list';
import { ProductForm } from './features/products/pages/product-form/product-form';
import { ProductStoreSelect } from './features/products/pages/product-store-select/product-store-select';

import { OrderList } from './features/orders/pages/order-list/order-list';
import { OrderDetails } from './features/orders/pages/order-details/order-details';
import { Analytics } from './features/analytics/pages/analytics/analytics';

import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { authGuard } from './core/guards/auth.guard';
import { superAdminGuard } from './core/guards/super-admin.guard';
import { AdminDashboard } from './features/super-admin-dashboard/admin-dashboard/admin-dashboard';
import { SuperAdminLayout } from './features/../layout/super-admin-layout/super-admin-layout';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'StorePilot | Commerce, Simplified',
  },
  {
    path: 'login',
    component: Login,
    title: 'Sign In | StorePilot',
  },
  {
    path: 'register',
    component: Register,
    title: 'Create Account | StorePilot',
  },

  // Super Admin
{
  path: 'admin',
  component: SuperAdminLayout,
  canActivate: [superAdminGuard],
  children: [
    {
      path: '',
      component: AdminDashboard,
      title: 'Platform Overview | StorePilot',
    },
  ],
},

  // Store Owner Dashboard
  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: Overview,
        title: 'Dashboard | StorePilot',
      },
      {
        path: 'stores',
        component: StoreList,
        title: 'My Stores | StorePilot',
      },
      {
        path: 'stores/new',
        component: StoreForm,
        title: 'Create Store | StorePilot',
      },
      {
        path: 'stores/:id/edit',
        component: StoreForm,
        title: 'Edit Store | StorePilot',
      },
      {
        path: 'stores/:storeId/products',
        component: ProductList,
        title: 'Products | StorePilot',
      },
      {
        path: 'stores/:storeId/products/new',
        component: ProductForm,
        title: 'Add Product | StorePilot',
      },
      {
        path: 'stores/:storeId/products/:id/edit',
        component: ProductForm,
        title: 'Edit Product | StorePilot',
      },
      {
        path: 'stores/:storeId/orders',
        component: OrderList,
        title: 'Orders | StorePilot',
      },
      {
        path: 'stores/:storeId/orders/:orderId',
        component: OrderDetails,
        title: 'Order Details | StorePilot',
      },
      {
        path: 'analytics',
        component: Analytics,
        title: 'Analytics | StorePilot',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
