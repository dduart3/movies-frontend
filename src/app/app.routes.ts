import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { UserListComponent } from './admin/components/user-list/user-list.component';
import { UserEditComponent } from './admin/components/user-edit/user-edit.component'; // ¡Importa el nuevo componente!

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Rutas de películas (cargadas de forma lazy)
  {
    path: 'movies',
    loadChildren: () => import('./movies/movies.routes').then(m => m.MOVIES_ROUTES),
    canActivate: [AuthGuard]
  },
  // Rutas de administración de usuarios
  {
    path: 'admin/users', // Ruta para la lista de usuarios
    component: UserListComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/users/edit/:id', // ¡NUEVA RUTA PARA EDICIÓN DE USUARIO!
    component: UserEditComponent,
    canActivate: [AdminGuard] // Solo administradores pueden editar usuarios
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];