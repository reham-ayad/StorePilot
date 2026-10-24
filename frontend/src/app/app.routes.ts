
import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Overview } from './features/dashboard/pages/overview/overview';

import { StoreList } from './features/stores/pages/store-list/store-list';
import { StoreForm } from './features/stores/pages/store-form/store-form';

import { ProductList } from './features/products/pages/product-list/product-list';
import { ProductForm } from './features/products/pages/product-form/product-form';
import { ProductStoreSelect } from './features/products/pages/product-store-select/product-store-select';

import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
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
        path: 'stores/:storeId/products',
        component: ProductList,
        title: 'Store Products | StorePilot',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
