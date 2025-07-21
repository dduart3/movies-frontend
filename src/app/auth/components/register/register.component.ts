import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Necesario para formularios reactivos
import { Router, RouterLink } from '@angular/router'; // RouterLink para el enlace "Ya tienes cuenta?"
import { AuthService } from '../../services/auth.service'; // Asegúrate de la ruta

@Component({
  selector: 'app-register',
  standalone: true, // ¡Este componente es standalone!
  imports: [
    CommonModule,
    ReactiveFormsModule, // Importa ReactiveFormsModule aquí
    RouterLink // Importa RouterLink para usar [routerLink]
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Si el usuario ya está logueado, redirige a la página de películas
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/movies']);
    }

    // Inicializa el formulario con sus validadores
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator }); // Añade un validador personalizado
  }

  ngOnInit(): void {
  }

  // Validador personalizado para asegurar que las contraseñas coinciden
  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  // Getter para un acceso fácil a los controles del formulario en el HTML
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.loading = true;
    this.error = null;

    if (this.registerForm.invalid) {
      this.loading = false;
      this.error = 'Por favor, completa todos los campos correctamente.';
      this.registerForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
      return;
    }

    const { username, email, password } = this.registerForm.value;

    this.authService.register(username, email, password)
      .subscribe({
        next: (data) => {
          console.log('Registro exitoso', data);
          this.router.navigate(['/movies']); // Redirige al usuario después del registro
        },
        error: (err) => {
          this.error = err.message || 'Error en el registro. Inténtalo de nuevo.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}