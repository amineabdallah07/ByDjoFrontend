import { Routes } from '@angular/router';
import { AccountPageComponent } from './account-page.component';
import { OrdersPageComponent } from './orders-page.component';
import { WishlistPageComponent } from './wishlist-page.component';

export const ACCOUNT_ROUTES: Routes = [
  { path: '', component: AccountPageComponent },
  { path: 'orders', component: OrdersPageComponent },
  { path: 'wishlist', component: WishlistPageComponent }
];
