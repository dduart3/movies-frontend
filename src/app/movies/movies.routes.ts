import { Routes } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list.component'; // Importa el componente
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component'; // Importa el componente
import { AdminGuard } from '../shared/guards/admin.guard'; // Necesitas este guard (ya existe)

export const MOVIES_ROUTES: Routes = [
  { path: '', component: MovieListComponent }, // Ruta para listar todas las películas
  // La ruta para crear/editar la crearemos en la próxima sección
  // { path: 'create', component: MovieFormComponent, canActivate: [AdminGuard] },
  // { path: 'edit/:id', component: MovieFormComponent, canActivate: [AdminGuard] },
  { path: ':id', component: MovieDetailComponent } // Ruta para ver los detalles de una película específica
];