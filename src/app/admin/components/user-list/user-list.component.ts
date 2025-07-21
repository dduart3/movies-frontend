import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Para *ngIf, *ngFor y DatePipe
import { UserService, User } from '../../services/user.service'; // Servicio de usuarios
import { RouterLink } from '@angular/router'; // Para enlaces a edición de usuario

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, // Necesario para el routerLink en el HTML
    DatePipe // Asegúrate de incluir DatePipe para el formateo de fechas
  ],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error: string | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'No se pudieron cargar los usuarios.';
        this.loading = false;
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  deleteUser(userId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar a este usuario?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          console.log('Usuario eliminado con éxito.');
          this.loadUsers(); // Recarga la lista después de la eliminación
        },
        error: (err) => {
          this.error = err.message || 'Error al eliminar el usuario.';
          console.error('Error al eliminar usuario:', err);
        }
      });
    }
  }

  // Función para cambiar el rol de un usuario directamente en la tabla
  // Esto enviaría un PUT a la API
  toggleUserRole(user: User): void {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (confirm(`¿Estás seguro de que quieres cambiar el rol de ${user.username} a "${newRole}"?`)) {
      // Opcional: Impedir que un admin se cambie su propio rol aquí
      // Esto requeriría acceder al usuario autenticado (AuthService) y comparar IDs.
      this.userService.updateUser(user._id, { role: newRole }).subscribe({
        next: (updatedUser) => {
          console.log('Rol de usuario actualizado:', updatedUser);
          user.role = updatedUser.role; // Actualiza el rol en la UI
        },
        error: (err) => {
          this.error = err.message || 'Error al cambiar el rol del usuario.';
          console.error('Error al cambiar rol:', err);
        }
      });
    }
  }
}