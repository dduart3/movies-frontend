import { CanActivateFn, Router } from '@angular/router'; // Usa CanActivateFn
import { inject } from '@angular/core'; // Necesario para inject
import { AuthService } from '../../auth/services/auth.service'; // Asegúrate de la ruta

export const AdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyecta el servicio
  const router = inject(Router); // Inyecta el router

  const currentUser = authService.currentUserValue;

  if (currentUser && currentUser.role === 'admin') {
    return true; // El usuario es administrador, permite el acceso
  } else {
    alert('Acceso denegado. Se requieren permisos de administrador para esta acción.');
    router.navigate(['/movies']); // Redirige a una página de acceso denegado o al inicio
    return false;
  }
};