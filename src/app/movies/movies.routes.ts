import { Routes } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { MovieFormComponent } from './components/movie-form/movie-form.component'; // ¡Importa el nuevo componente!
import { AdminGuard } from '../shared/guards/admin.guard';

export const MOVIES_ROUTES: Routes = [
  { path: '', component: MovieListComponent },
  {
    path: 'create',
    component: MovieFormComponent,
    canActivate: [AdminGuard] // Solo administradores pueden crear películas
  },
  {
    path: 'edit/:id',
    component: MovieFormComponent,
    canActivate: [AdminGuard] // Solo administradores pueden editar películas
  },
  { path: ':id', component: MovieDetailComponent }
];