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
      { 
        path: 'padaria',
        loadComponent: () => import('./home/dashboard/padaria/padaria').then(m => m.Padaria),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'vendas' },
          { path: 'produtos', loadComponent: () => import('./home/dashboard/padaria/produtos/produtos').then(m => m.Produtos) },
          { path: 'vendas', loadComponent: () => import('./home/dashboard/padaria/vendas/vendas').then(m => m.Vendas) },
          { path: 'caixa', loadComponent: () => import('./home/dashboard/padaria/caixa/caixa').then(m => m.Caixa) },
          { path: 'relatorios', loadComponent: () => import('./home/dashboard/padaria/relatorios/relatorios').then(m => m.Relatorios) },
          { path: 'estoque', loadComponent: () => import('./home/dashboard/padaria/estoque/estoque').then(m => m.Estoque) },
          { path: 'clientes', loadComponent: () => import('./home/dashboard/padaria/clientes/clientes').then(m => m.Clientes) },
        ]
      },
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
];
