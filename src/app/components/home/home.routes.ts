import { Routes } from "@angular/router";

export const HOME_ROUTES: Routes =[
    {path:'',pathMatch:'full',redirectTo:'home' },
    {
        path:'home',
        loadComponent:() =>
            import ('./home').then(m=>m.Home)
    }
];