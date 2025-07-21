import { CanActivateFn, Router } from '@angular/router'; // Usa CanActivateFn para guards funcionales
import { inject } from '@angular/core'; // Necesario para inject
import { AuthService } from '../../auth/services/auth.service'; // Asegúrate de la ruta

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyecta el servicio
  const router = inject(Router); // Inyecta el router

  if (authService.isLoggedIn()) {
    return true; // El usuario está autenticado, permite el acceso
  } else {
    // Si no está autenticado, redirige al login con la URL original como parámetro
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};