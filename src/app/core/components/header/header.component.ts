import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserData } from '../../../auth/services/auth.service'; // Importa AuthService y UserData
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  private userSubscription: Subscription | undefined; // Usaremos esta suscripción para currentUser

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Suscribirse a los cambios del usuario actual
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user; // Si hay un usuario, está logueado
      this.isAdmin = user?.role === 'admin'; // Si el rol es 'admin', es administrador
    });
  }

  logout(): void {
    this.authService.logout();
    // La redirección al login se manejará en el método `clearSession` de tu AuthService
    // this.router.navigate(['/login']); // Eliminar esta línea si AuthService ya redirige
  }

  ngOnDestroy(): void {
    // Es crucial desuscribirse para evitar fugas de memoria
    this.userSubscription?.unsubscribe();
  }
}