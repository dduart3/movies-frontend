import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// ¡Asegúrate de que esta línea esté presente y descomentada!
import 'zone.js'; // Importa Zone.js para la detección de cambios de Angular

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));