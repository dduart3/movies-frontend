import { Component, OnInit, OnDestroy } from '@angular/core'; // Añade OnInit y OnDestroy
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Para usar routerLink en el template
import { AuthService } from '../../app/auth/services/auth.service'; // Importa AuthService
import { Subscription } from 'rxjs'; // Para manejar la suscripción

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink // Asegúrate de importar RouterLink
  ],
  template: `
    <div class="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 p-4">
      <div class="text-center bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h1 class="text-5xl font-extrabold text-blue-700 mb-4 animate-fade-in">Bienvenido a MovieApp</h1>
        <p class="text-lg text-gray-700 mb-6 leading-relaxed animate-slide-up">
          Tu destino ideal para explorar el mundo del cine. Descubre nuevas películas, gestiona tu colección y mucho más.
        </p>
        <div class="space-x-4">
          <a routerLink="/movies" class="inline-block bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105">
            Ver Películas
          </a>
          <a *ngIf="!isLoggedIn" routerLink="/login" class="inline-block bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-300 transition duration-300 transform hover:scale-105">
            Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 1s ease-out;
    }
    .animate-slide-up {
      animation: slideUp 0.8s ease-out forwards;
      opacity: 0;
      animation-delay: 0.3s;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Suscribirse al Observable currentUser de AuthService
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user; // Si hay un objeto de usuario, entonces está logueado
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    this.userSubscription?.unsubscribe();
  }
}