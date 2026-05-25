import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './products/admin-products.component';
import { AdminOrdersComponent } from './orders/admin-orders.component';
import { AdminCustomersComponent } from './customers/admin-customers.component';
import { AdminPromotionsComponent } from './promotions/admin-promotions.component';
import { AdminSettingsComponent } from './settings/admin-settings.component';
import { AdminLayoutComponent } from './admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'customers', component: AdminCustomersComponent },
      { path: 'promotions', component: AdminPromotionsComponent },
      { path: 'settings', component: AdminSettingsComponent },
      { path: '**', redirectTo: '' }
    ]
  }
];
