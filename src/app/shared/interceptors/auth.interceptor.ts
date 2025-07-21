import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn, // Usa HttpHandlerFn para interceptores funcionales
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router';
import { inject } from '@angular/core'; // Necesario para inject en interceptores funcionales

// Interceptores en Angular 15+ pueden ser funcionales. Este es el formato recomendado.
export const AuthInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService); // Inyecta el servicio con inject()
  const router = inject(Router);

  const accessToken = authService.getAccessToken();
  if (accessToken) {
    request = addToken(request, accessToken);
  }

  return next(request).pipe( // Usa next(request) en lugar de next.handle(request)
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const isRefreshRoute = request.url.includes('/auth/token/refresh');
        const isAuthRoute = request.url.includes('/auth/login') || request.url.includes('/auth/register');

        if (!isRefreshRoute && !isAuthRoute) {
          // Si el access token expiró o es inválido, intenta renovarlo
          return handle401Error(request, next, authService);
        } else if (isRefreshRoute) {
          // Si el 401 viene de la propia solicitud de refresh, el refresh token es inválido/expirado
          authService.clearSession(); // Forzar cierre de sesión
          return throwError(() => error);
        }
      }
      return throwError(() => error);
    })
  );
};

// Funciones auxiliares para el interceptor
let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((newAccessToken: string) => {
        isRefreshing = false;
        refreshTokenSubject.next(newAccessToken);
        return next(addToken(request, newAccessToken)); // Reintentar la solicitud original con el nuevo token
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        authService.clearSession(); // Si el refresh falla, forzar logout
        return throwError(() => refreshError);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(addToken(request, token));
      })
    );
  }
}