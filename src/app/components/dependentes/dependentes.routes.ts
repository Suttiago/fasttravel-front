import { Routes } from '@angular/router';

export const DEPENDENTES_ROUTES: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'listar' },
    {
        path: 'listar',
        loadComponent: () =>
        import('./listar-dependentes/listar-dependentes').then(m => m.ListarDependentes)
    },

    {
        path:'cadastro',
        loadComponent:() =>
        import('./cadastro-dependentes/cadastro-dependentes').then(m=>m.CadastroDependentes)
    },




]