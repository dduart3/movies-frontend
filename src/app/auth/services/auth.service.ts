import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../../app-constants'; // Asegúrate de que la ruta sea correcta

// Interfaces para los datos de la respuesta de autenticación y los datos del usuario
interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserData { // Exporta esta interfaz para que pueda ser usada en otros componentes (ej. Navbar)
  _id: string;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root' // Este servicio es un singleton, disponible en toda la aplicación
})
export class AuthService {
  private apiUrl = `${API_BASE_URL}/auth`;
  private userSubject: BehaviorSubject<UserData | null>;
  public currentUser: Observable<UserData | null>;

  constructor(private http: HttpClient, private router: Router) {
    // Intenta cargar el usuario desde localStorage al inicio de la aplicación
    const storedUser = localStorage.getItem('currentUser');
    this.userSubject = new BehaviorSubject<UserData | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.userSubject.asObservable(); // Hace público el Observable del usuario
  }

  // Getter para obtener el valor actual del usuario sin suscribirse
  public get currentUserValue(): UserData | null {
    return this.userSubject.value;
  }

  // Obtiene el access token del localStorage
  public getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Obtiene el refresh token del localStorage
  public getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Verifica si el usuario está logueado (tiene un access token)
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  // Verifica si el usuario tiene un rol específico
  hasRole(requiredRole: string): boolean {
    const user = this.currentUserValue;
    return user?.role === requiredRole;
  }

  // ------------------------- Métodos de Autenticación -------------------------

  register(username: string, email: string, password: string, role?: string): Observable<AuthResponse> {
    const body = { username, email, password, role };
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, body).pipe(
      tap((response: AuthResponse) => {
        this.setTokens(response.accessToken, response.refreshToken);
        this.setCurrentUser(response);
      }),
      catchError(error => {
        console.error('Error al registrar:', error);
        return throwError(() => new Error(error.error?.message || 'Error en el registro'));
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const body = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, body).pipe(
      tap((response: AuthResponse) => {
        this.setTokens(response.accessToken, response.refreshToken);
        this.setCurrentUser(response);
      }),
      catchError(error => {
        console.error('Error al iniciar sesión:', error);
        return throwError(() => new Error(error.error?.message || 'Credenciales inválidas'));
      })
    );
  }

  logout(): void {
    // Llama al backend para invalidar el refresh token (opcional, pero buena práctica)
    this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      catchError(error => {
        console.warn('Error al cerrar sesión en el backend, procediendo con cierre local:', error);
        return of(null); // No bloqueamos el logout local si falla el backend
      })
    ).subscribe(() => {
      this.clearSession(); // Limpia la sesión localmente
    });
  }

  // ------------------------- Manejo de Tokens y Sesión -------------------------

  // Guarda los tokens en localStorage
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Elimina los tokens y el usuario del localStorage y resetea el BehaviorSubject
  public clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.userSubject.next(null); // Emite null para que los suscriptores sepan que no hay usuario
    this.router.navigate(['/login']); // Cambia a /login si esa es tu ruta
}

  // Renueva el access token usando el refresh token
  // Usado principalmente por el interceptor cuando el access token expira
  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearSession(); // Si no hay refresh token, forzar logout
      return throwError(() => new Error('No hay refresh token disponible. Por favor inicie sesión.'));
    }

    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/token/refresh`, { refreshToken }).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken); // Actualiza solo el access token
        console.log('Access token renovado con éxito.');
      }),
      map(response => response.accessToken),
      catchError(error => {
        console.error('Error al renovar token:', error);
        this.clearSession(); // Si la renovación falla, la sesión es inválida, forzar logout
        return throwError(() => new Error(error.error?.message || 'No se pudo renovar el token. Sesión expirada.'));
      })
    );
  }

  // ------------------------- Gestión del Usuario Actual -------------------------

  // Establece el usuario actual en el BehaviorSubject y en localStorage
  private setCurrentUser(authResponse: AuthResponse): void {
    const userData: UserData = {
      _id: authResponse._id,
      username: authResponse.username,
      email: authResponse.email,
      role: authResponse.role
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    this.userSubject.next(userData); // Emite el nuevo usuario para los suscriptores
  }
}