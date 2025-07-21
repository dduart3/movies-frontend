import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../../app-constants'; // Asegúrate de que esta ruta sea correcta

// Interfaz para representar la estructura de un usuario
// Adapta esto exactamente a cómo luce tu modelo de usuario en el backend
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin'; // Asumiendo que tienes roles 'user' y 'admin'
  createdAt: string; // Si tu modelo de usuario tiene esto
  updatedAt: string; // Si tu modelo de usuario tiene esto
  // No incluyas 'password' aquí por seguridad
}

@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class UserService {
  private apiUrl = `${API_BASE_URL}/users`; // Endpoint de tu API para usuarios

  constructor(private http: HttpClient) { }

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

  /**
   * Obtiene todos los usuarios del backend (solo para administradores).
   * @returns Un Observable con un array de usuarios.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene un usuario específico por su ID (solo para administradores).
   * @param id El ID del usuario.
   * @returns Un Observable con el usuario encontrado.
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza un usuario existente (solo para administradores).
   * @param id El ID del usuario a actualizar.
   * @param user Los datos actualizados del usuario. Usamos Partial<User> para permitir actualizaciones parciales.
   * @returns Un Observable con el usuario actualizado.
   */
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina un usuario por su ID (solo para administradores).
   * @param id El ID del usuario a eliminar.
   * @returns Un Observable con la respuesta de la eliminación.
   */
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}