import { Routes } from '@angular/router';
// Importa tus componentes de películas aquí cuando los crees
// import { MovieListComponent } from './components/movie-list/movie-list.component';
// import { MovieFormComponent } from './components/movie-form/movie-form.component';
// import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { AdminGuard } from '../shared/guards/admin.guard'; // Necesitas este guard

export const MOVIES_ROUTES: Routes = [
  // { path: '', component: MovieListComponent },
  // { path: 'create', component: MovieFormComponent, canActivate: [AdminGuard] },
  // { path: 'edit/:id', component: MovieFormComponent, canActivate: [AdminGuard] },
  // { path: ':id', component: MovieDetailComponent }
];