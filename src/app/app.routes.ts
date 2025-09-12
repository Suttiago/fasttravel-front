import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren:() =>
            import ('./components/home/home.routes').then(m=>m.HOME_ROUTES)
    },
    {
        path:'usuarios',
        loadChildren:()=>
            import('./components/usuario/usuario.routes').then(m=>m.USUARIO_ROUTES)
    },

    {
        path:'dependentes',
        loadChildren:()=>
            import('./components/dependentes/dependentes.routes').then(m=>m.DEPENDENTES_ROUTES)

    }
];
