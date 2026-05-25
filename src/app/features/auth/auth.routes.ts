import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '**', redirectTo: 'login' }
];
