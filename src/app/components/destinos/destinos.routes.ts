import { Routes } from '@angular/router';

export const DESTINO_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'listar' },
  {
    path: 'listar',
    loadComponent: () =>
      import('./listar-destino/listar-destino').then(m => m.ListarDestino)
  },

  {
    path:'cadastro',
    loadComponent:() =>
      import('./cadastro-destino/cadastro-destino').then(m=>m.CadastroDestino)
  },

  
];