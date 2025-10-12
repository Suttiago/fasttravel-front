import { Routes } from '@angular/router';

export const FINANCEIRO_ROUTES: Routes = [
  {
    path: 'financeiro',
    children: [
      {
        path: 'contas-pagar',
        loadComponent: () => import('./contas-pagar/contas-pagar').then(m => m.ContasPagar)
      }
    ]
  }
];
