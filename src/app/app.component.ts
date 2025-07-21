import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas comunes como *ngIf, *ngFor
import { RouterOutlet } from '@angular/router'; // Necesario para <router-outlet>
import { NavbarComponent } from './shared/components/navbar/navbar.component'; // Importa el NavbarComponent

@Component({
  selector: 'app-root', // Este selector es el que se usa en src/index.html
  standalone: true, // Indica que este es un componente standalone
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent // Añade el NavbarComponent a los imports de este componente standalone
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'movies-frontend';
}