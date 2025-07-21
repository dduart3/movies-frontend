import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../../../app/app-constants';

// Interfaz CORRECTA para representar la estructura de una película,
// basada en tu controlador de backend.
export interface Movie {
  _id?: string; // El ID es generado por MongoDB, opcional al crear
  title: string;
  director: string;
  genre: string[]; // Tu backend espera un array de strings
  releaseYear: number; // CAMBIO: Usar 'releaseYear' como en tu backend
  synopsis?: string; // Opcional, como en tu backend
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = `${API_BASE_URL}/movies`;

  constructor(private http: HttpClient) { }

  // ------------------------- Métodos CRUD (NO CAMBIAN AQUÍ, ya que usan la interfaz) -------------------------

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getMovieById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie).pipe(
      catchError(this.handleError)
    );
  }

  updateMovie(id: string, movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${id}`, movie).pipe(
      catchError(this.handleError)
    );
  }

  deleteMovie(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}\nDetail: ${error.error?.message || ''}`;
      console.error('Backend returned code %d, body was: %o', error.status, error.error);
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}