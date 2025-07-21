import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard'; // Importaremos este guard más adelante
import { AdminGuard } from './shared/guards/admin.guard'; // Importaremos este guard más adelante

export const routes: Routes = [
  { path: '', redirectTo: '/movies', pathMatch: 'full' }, // Redirige a /movies por defecto
  {
    path: 'auth',
    // Carga perezosa de las rutas de autenticación
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'movies',
    // Carga perezosa de las rutas de películas
    loadChildren: () => import('./movies/movies.routes').then(m => m.MOVIES_ROUTES),
    canActivate: [AuthGuard] // Protege todas las rutas hijas de /movies
  },
  {
    path: 'admin', // Una ruta base para las funcionalidades de administración
    // Carga perezosa de las rutas de administración (si decides implementarlas)
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [AuthGuard, AdminGuard] // Requiere autenticación y rol de admin
  },
  { path: '**', redirectTo: '/movies' } // Ruta comodín para cualquier URL no definida
];