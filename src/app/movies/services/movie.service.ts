import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../../app-constants'; // Asegúrate de que la ruta sea correcta

// Interfaz para representar la estructura de una película
export interface Movie {
  _id?: string; // El ID será opcional al crear una nueva película
  title: string;
  director: string;
  releaseYear: number;
  genre: string[]; // Un array de strings para los géneros
  posterUrl?: string; // URL del póster, opcional
  rating?: number; // Calificación (ej. IMDB), opcional
  synopsis?: string; // Sinopsis de la película, opcional
}

@Injectable({
  providedIn: 'root' // Este servicio es un singleton, disponible en toda la aplicación
})
export class MovieService {
  private apiUrl = `${API_BASE_URL}/movies`; // Endpoint de tu API para películas

  constructor(private http: HttpClient) { }

  // ------------------------- Métodos CRUD -------------------------

  /**
   * Obtiene todas las películas del backend.
   * @returns Un Observable con un array de películas.
   */
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una película específica por su ID.
   * @param id El ID de la película.
   * @returns Un Observable con la película encontrada.
   */
  getMovieById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva película.
   * @param movie Los datos de la nueva película.
   * @returns Un Observable con la película creada.
   */
  createMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una película existente.
   * @param id El ID de la película a actualizar.
   * @param movie Los datos actualizados de la película.
   * @returns Un Observable con la película actualizada.
   */
  updateMovie(id: string, movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${id}`, movie).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina una película por su ID.
   * @param id El ID de la película a eliminar.
   * @returns Un Observable con la respuesta de la eliminación.
   */
  deleteMovie(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ------------------------- Manejo de Errores -------------------------

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}\nDetail: ${error.error?.message || ''}`;
      console.error('Backend returned code %d, body was: %o', error.status, error.error);
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}