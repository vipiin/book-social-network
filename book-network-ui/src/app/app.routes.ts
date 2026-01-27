import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AcivateAccount } from './pages/acivate-account/acivate-account';
import { authGuard } from './services/guard/auth-guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'activate-account',
        component: AcivateAccount
    },
    {
        path: 'books',
        loadChildren: () => import('./modules/book/book-module').then(m => m.BookModule),
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
