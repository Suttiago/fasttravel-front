import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren:() =>
            import ('./components/home/home.routes').then(m=>m.HOME_ROUTES)
    },
    {
        path:'clientes',
        loadChildren:()=>
            import('./components/usuario/usuario.routes').then(m=>m.CLIENTES_ROUTES)
    }
];
