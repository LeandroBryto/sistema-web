import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./home/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'usuarios', loadComponent: () => import('./home/usuarios/usuarios').then(m => m.Usuarios) },
      { path: 'projetos', loadComponent: () => import('./home/projetos/projetos').then(m => m.Projetos) },
      { path: 'financeiro', loadComponent: () => import('./home/financeiro/financeiro').then(m => m.Financeiro) },
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
];
