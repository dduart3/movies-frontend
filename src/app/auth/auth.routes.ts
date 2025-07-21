import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component'; // Importa el componente Login
import { RegisterComponent } from './components/register/register.component'; // Importa el componente Register

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' } // Redirige a login por defecto en /auth
];