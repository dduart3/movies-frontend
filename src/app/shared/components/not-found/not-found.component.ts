import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Si necesitas *ngIf, *ngFor, etc.
import { RouterLink } from '@angular/router'; // Para el enlace de "Volver al inicio"

@Component({
  selector: 'app-not-found',
  standalone: true, // ¡Es un componente standalone!
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 p-4 text-center">
      <h1 class="text-9xl font-extrabold text-gray-300 animate-bounce">404</h1>
      <p class="text-2xl font-semibold text-gray-800 mb-4">¡Ups! Página No Encontrada</p>
      <p class="text-gray-600 mb-8">Parece que te has perdido. La página que buscas no existe.</p>
      <a routerLink="/" class="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105">
        Volver al Inicio
      </a>
    </div>
  `,
  styles: [`
    .animate-bounce {
      animation: bounce 1s infinite;
    }
    @keyframes bounce {
      0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }
  `]
})
export class NotFoundComponent { }