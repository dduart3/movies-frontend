import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf, *ngFor
import { RouterLink } from '@angular/router'; // Para enlaces a detalles y edición
import { Movie, MovieService } from '../../services/movie.service'; // Importa el servicio y la interfaz
import { AuthService } from '../../../auth/services/auth.service'; // Para comprobar roles de usuario

@Component({
  selector: 'app-movie-list',
  standalone: true, // ¡Este es un componente standalone!
  imports: [
    CommonModule,
    RouterLink // Asegúrate de importar RouterLink
  ],
  templateUrl: './movie-list.component.html',
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private movieService: MovieService,
    private authService: AuthService // Inyecta AuthService para verificación de rol
  ) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.error = null;
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'No se pudieron cargar las películas.';
        this.loading = false;
        console.error('Error al cargar películas:', err);
      }
    });
  }

  // Comprueba si el usuario actual es un administrador
  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  deleteMovie(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta película?')) {
      this.movieService.deleteMovie(id).subscribe({
        next: () => {
          console.log('Película eliminada con éxito.');
          this.loadMovies(); // Recarga la lista de películas después de la eliminación
        },
        error: (err) => {
          this.error = err.message || 'Error al eliminar la película.';
          console.error('Error al eliminar película:', err);
        }
      });
    }
  }
}