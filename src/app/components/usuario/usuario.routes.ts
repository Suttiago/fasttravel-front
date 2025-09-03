import { Routes } from '@angular/router';

export const CLIENTES_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'listar' },
  {
    path: 'listar',
    loadComponent: () =>
      import('./listar-usuario/listar-usuario').then(m => m.ListarUsuario)
  },

  
];