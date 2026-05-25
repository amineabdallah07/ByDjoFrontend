import { Routes } from '@angular/router';
import { ProductDetailPageComponent } from './product-detail-page.component';

export const PRODUCT_ROUTES: Routes = [
  { path: ':slug', component: ProductDetailPageComponent }
];
