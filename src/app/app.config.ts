import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importa withInterceptors para interceptores

import { routes } from './app.routes'; // Importa tus rutas principales
import { AuthInterceptor } from './shared/interceptors/auth.interceptor'; // Importa tu interceptor de autenticación

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Configura el enrutador con tus rutas
    // Configura HttpClient y añade tu interceptor
    provideHttpClient(withInterceptors([AuthInterceptor])),
    // Aquí puedes añadir otros servicios que sean singletons o necesiten ser globales
  ]
};