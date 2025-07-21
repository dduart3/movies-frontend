import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Necesario para formularios reactivos
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; // RouterLink para el enlace "No tienes cuenta?"
import { AuthService } from '../../services/auth.service'; // Asegúrate de la ruta

@Component({
  selector: 'app-login',
  standalone: true, // ¡Este componente es standalone!
  imports: [
    CommonModule,
    ReactiveFormsModule, // Importa ReactiveFormsModule aquí
    RouterLink // Importa RouterLink para usar [routerLink]
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;
  returnUrl: string | null = null; // Para redirigir al usuario a la URL de donde vino

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute // Inyectamos ActivatedRoute para obtener queryParams
  ) {
    // Si el usuario ya está logueado, redirige a la página de películas
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/movies']);
    }

    // Inicializa el formulario de login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Obtiene la URL a la que el usuario intentó acceder antes de ser redirigido al login
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/movies';
  }

  // Getter para un acceso fácil a los controles del formulario en el HTML
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.loading = true;
    this.error = null;

    if (this.loginForm.invalid) {
      this.loading = false;
      this.error = 'Por favor, introduce tu correo y contraseña.';
      this.loginForm.markAllAsTouched(); // Marca todos los campos como tocados
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .subscribe({
        next: (data) => {
          console.log('Inicio de sesión exitoso', data);
          // Redirige al usuario a la URL original o a la página de películas por defecto
          this.router.navigate([this.returnUrl]);
        },
        error: (err) => {
          this.error = err.message || 'Error al iniciar sesión. Verifica tus credenciales.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}