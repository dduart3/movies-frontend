import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Importa ActivatedRoute
import { UserService, User } from '../../services/user.service'; // Importa UserService, User y UserData (si usas UserData para el formulario)
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa FormBuilder, FormGroup, Validators

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,          // Para formularios de plantilla si decides usarlos
    ReactiveFormsModule,  // Para formularios reactivos (preferido para formularios complejos)
    RouterLink            // Por si hay un botón de "Volver"
  ],
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit {
  userId: string | null = null;
  userForm!: FormGroup; // Usaremos un formulario reactivo
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;

  // Opciones de rol (para el select)
  roles: string[] = ['user', 'admin'];

  constructor(
    private fb: FormBuilder, // Inyecta FormBuilder
    private userService: UserService,
    private route: ActivatedRoute, // Para obtener el ID de la URL
    private router: Router // Para redirigir
  ) { }

  ngOnInit(): void {
    // Inicializar el formulario con valores por defecto
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });

    // Obtener el ID del usuario de la URL
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.loadUser(this.userId);
    } else {
      this.error = 'ID de usuario no proporcionado.';
      this.loading = false;
    }
  }

  loadUser(id: string): void {
    this.loading = true;
    this.error = null;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        // Llenar el formulario con los datos del usuario
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          role: user.role
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'No se pudo cargar el usuario para edición.';
        this.loading = false;
        console.error('Error al cargar usuario:', err);
      }
    });
  }

  onSubmit(): void {
    this.successMessage = null;
    this.error = null;
    if (this.userForm.valid && this.userId) {
      this.loading = true;
      const updatedUser: Partial<User> = this.userForm.value; // Obtener los valores del formulario
      
      this.userService.updateUser(this.userId, updatedUser).subscribe({
        next: (response) => {
          this.successMessage = 'Usuario actualizado con éxito.';
          this.loading = false;
          // Opcional: Redirigir de vuelta a la lista de usuarios o mostrar un mensaje
          setTimeout(() => {
            this.router.navigate(['/admin/users']);
          }, 1500); // Redirigir después de 1.5 segundos
        },
        error: (err) => {
          this.error = err.message || 'Error al actualizar el usuario.';
          this.loading = false;
          console.error('Error al actualizar usuario:', err);
        }
      });
    } else {
      this.error = 'Por favor, completa todos los campos requeridos correctamente.';
    }
  }
}