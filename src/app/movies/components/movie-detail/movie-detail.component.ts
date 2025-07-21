import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Movie, MovieService } from '../../services/movie.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './movie-detail.component.html',
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | undefined;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private authService: AuthService
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

  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }
}