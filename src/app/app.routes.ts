import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
  { path: 'home', component: Home },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
];
