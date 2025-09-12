import { Routes } from '@angular/router';

export const USUARIO_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'listar' },
  {
    path: 'listar',
    loadComponent: () =>
      import('./listar-usuario/listar-usuario').then(m => m.ListarUsuario)
  },

  {
    path:'cadastro',
    loadComponent:() =>
      import('./cadastro-usuario/cadastro-usuario').then(m=>m.CadastroUsuario)
  },

  {
    path:'login',
    loadComponent:()=>
      import('./login/login').then(m=>m.Login)
  }
  
];