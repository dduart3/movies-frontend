import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { ActivatedRoute, RouterLink } from '@angular/router'; // ActivatedRoute para obtener el ID de la URL, RouterLink para el botón de regreso
import { Movie, MovieService } from '../../services/movie.service'; // Importa el servicio y la interfaz
import { AuthService } from '../../../auth/services/auth.service'; // Para verificar roles

@Component({
  selector: 'app-movie-detail',
  standalone: true, // ¡Este es un componente standalone!
  imports: [
    CommonModule,
    RouterLink // Asegúrate de importar RouterLink
  ],
  templateUrl: './movie-detail.component.html',
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | undefined;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute, // Para acceder a los parámetros de la URL
    private movieService: MovieService,
    private authService: AuthService // Inyecta AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const movieId = params.get('id');
      if (movieId) {
        this.loadMovieDetail(movieId);
      } else {
        this.error = 'ID de película no proporcionado.';
        this.loading = false;
      }
    });
  }

  loadMovieDetail(id: string): void {
    this.loading = true;
    this.error = null;
    this.movieService.getMovieById(id).subscribe({
      next: (data) => {
        this.movie = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'No se pudo cargar la película.';
        this.loading = false;
        console.error('Error al cargar detalles de película:', err);
      }
    });
  }

  // Comprueba si el usuario actual es un administrador
  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }
}