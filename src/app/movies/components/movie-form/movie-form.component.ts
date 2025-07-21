import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Movie, MovieService } from '../../services/movie.service'; // Servicio de películas

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './movie-form.component.html',
})
export class MovieFormComponent implements OnInit {
  movieForm: FormGroup;
  isEditMode = false;
  movieId: string | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Inicializa el formulario con los campos de tu backend
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      director: ['', Validators.required],
      genre: ['', Validators.required], // Se manejará como string y se convertirá a array
      releaseYear: ['', [Validators.required, Validators.min(1888), Validators.max(new Date().getFullYear() + 5)]], // CAMBIO: releaseYear
      synopsis: [''] // Opcional
      // Eliminados: posterUrl, rating
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.movieId = params.get('id');
      if (this.movieId) {
        this.isEditMode = true;
        this.loadMovie(this.movieId);
      }
    });
  }

  get f() { return this.movieForm.controls; }

  loadMovie(id: string): void {
    this.loading = true;
    this.movieService.getMovieById(id).subscribe({
      next: (movie) => {
        // Carga los datos de la película en el formulario.
        // `genre` es un array, lo convertimos a string para el input
        this.movieForm.patchValue({
          title: movie.title,
          director: movie.director,
          releaseYear: movie.releaseYear, // CORRECCIÓN: releaseYear
          genre: movie.genre ? movie.genre.join(', ') : '', // Convierte array a string
          synopsis: movie.synopsis
          // Eliminados: posterUrl, rating
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'No se pudo cargar la película para edición.';
        this.loading = false;
        console.error('Error al cargar película:', err);
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = null;

    if (this.movieForm.invalid) {
      this.loading = false;
      this.error = 'Por favor, completa todos los campos requeridos y corrige los errores.';
      this.movieForm.markAllAsTouched();
      return;
    }

    // Prepara los datos del formulario antes de enviarlos
    const movieData: Movie = {
      ...this.movieForm.value,
      // Convierte el string de géneros de nuevo a un array
      genre: this.movieForm.value.genre.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    };
    // Asegúrate de que movieData NO incluya posterUrl ni rating

    if (this.isEditMode && this.movieId) {
      this.movieService.updateMovie(this.movieId, movieData).subscribe({
        next: () => {
          console.log('Película actualizada con éxito.');
          this.router.navigate(['/movies', this.movieId]);
        },
        error: (err) => {
          this.error = err.message || 'Error al actualizar la película.';
          this.loading = false;
          console.error('Error al actualizar película:', err);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.movieService.createMovie(movieData).subscribe({
        next: () => {
          console.log('Película creada con éxito.');
          this.router.navigate(['/movies']);
        },
        error: (err) => {
          this.error = err.message || 'Error al crear la película.';
          this.loading = false;
          console.error('Error al crear película:', err);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}