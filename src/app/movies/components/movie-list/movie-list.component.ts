import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie, MovieService } from '../../services/movie.service';
import { AuthService } from '../../../auth/services/auth.service'; // Para comprobar roles de usuario

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './movie-list.component.html',
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private movieService: MovieService,
    private authService: AuthService
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

  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  deleteMovie(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta película?')) {
      this.movieService.deleteMovie(id).subscribe({
        next: () => {
          console.log('Película eliminada con éxito.');
          this.loadMovies();
        },
        error: (err) => {
          this.error = err.message || 'Error al eliminar la película.';
          console.error('Error al eliminar película:', err);
        }
      });
    }
  }
}