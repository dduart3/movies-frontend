import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { Router, RouterLink } from '@angular/router'; // RouterLink para los enlaces de navegación
import { AuthService, UserData } from '../../../auth/services/auth.service'; // Asegúrate de la ruta
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true, // ¡Este componente es standalone!
  imports: [
    CommonModule, // Necesario para directivas como *ngIf
    RouterLink // Necesario para [routerLink]
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: UserData | null = null;
  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Suscríbete a los cambios del usuario actual para actualizar el navbar dinámicamente
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }

  // Método para verificar si el usuario tiene un rol específico (para mostrar/ocultar enlaces)
  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }
}