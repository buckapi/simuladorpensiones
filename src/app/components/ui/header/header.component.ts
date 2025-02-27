import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { AuthPocketbaseService } from '../../../services/auth-pocketbase.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2'; // Asegúrate de importar SweetAlert
import * as bootstrap from 'bootstrap'; // Importa Bootstrap
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn: boolean = false; // Estado de inicio de sesión
  loginForm: FormGroup;
  showModal: boolean = false;

constructor(
  public global: GlobalService,
  public auth: AuthPocketbaseService,
  private fb: FormBuilder        
) {
  this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
this.loginForm = this.fb.group({
  username: [null, [Validators.required]],
  password: [null, [Validators.required]],
});
if (!this.isLoggedIn) {
  this.showModal = true; // Mostrar el modal si no está logueado
}
}
ngOnInit() {
  // Verifica si el usuario está logueado al cargar el componente
  this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
}
private usuariosPredefinidos = [
  { username: 'JXQWZLTA', password: '9Bf7T2Xy' },
  { username: 'MNBVCXZA', password: 'K4d2P8Lm' },
  { username: 'QWERTYUI', password: 'Zx7Bv9Nt' },
  { username: 'ASDFGHJK', password: 'P6Lm3NqT' },
  { username: 'POIUYTRE', password: 'V1Xy9ZbM' },
  ];
logoutUser() {
  this.isLoggedIn = false;
  localStorage.setItem('isLoggedIn', 'false');
  this.auth.logoutUser().subscribe(
    (response) => {
      console.log('Sesión cerrada exitosamente', response);
      this.global.setRoute('login');
    },
    (error) => {
      console.error('Error al cerrar sesión', error);
    }
  );
}

loginUser() {
  if (this.loginForm.valid) {
    const { username, password } = this.loginForm.value;

    const usuario = this.usuariosPredefinidos.find(user => user.username === username && user.password === password);

    if (usuario) {
      console.log('Inicio de sesión exitoso', usuario);
      this.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      this.showModal = false; // Cerrar el modal al iniciar sesión

      Swal.fire({
        title: 'Éxito!',
        text: 'Inicio de sesión exitoso',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        const modal = document.getElementById('loginModal');
        if (modal) {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide(); // Cierra el modal
          }
        }

        this.global.setRoute('home'); // Redirige al inicio
      });
    } else {
      console.error('Credenciales incorrectas. Intenta de nuevo.');
      Swal.fire({
        title: 'Error!',
        text: 'Credenciales incorrectas. Intenta de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  } else {
    console.error('Por favor, complete todos los campos requeridos.');
  }
}
/* logoutUser() {
  this.isLoggedIn = false; // Cambia el estado a no iniciado sesión
  localStorage.setItem('isLoggedIn', 'false'); // Actualizar en localStorage
  this.auth.logoutUser().subscribe(
      (response) => {
          console.log('Sesión cerrada exitosamente', response);
          this.global.setRoute('login'); // Redirigir a la página de inicio
      },
      (error) => {
          console.error('Error al cerrar sesión', error);
      }
  );
}



private usuariosPredefinidos = [
{ username: 'JXQWZLTA', password: '9Bf7T2Xy' },
{ username: 'MNBVCXZA', password: 'K4d2P8Lm' },
{ username: 'QWERTYUI', password: 'Zx7Bv9Nt' },
{ username: 'ASDFGHJK', password: 'P6Lm3NqT' },
{ username: 'POIUYTRE', password: 'V1Xy9ZbM' },
];
loginUser() {
if (this.loginForm.valid) {
    const { username, password } = this.loginForm.value;

    const usuario = this.usuariosPredefinidos.find(user => user.username === username && user.password === password);

    if (usuario) {
        console.log('Inicio de sesión exitoso', usuario);
        this.isLoggedIn = true; // Cambia el estado a iniciado sesión
        localStorage.setItem('isLoggedIn', 'true'); // Guardar en localStorage

        Swal.fire({
            title: 'Éxito!',
            text: 'Inicio de sesión exitoso',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            const modal = document.getElementById('loginModal');
            if (modal) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide(); // Cerrar el modal
                }
            }

            this.global.setRoute('home'); // Redirigir a la página de inicio
        });
    } else {
        console.error('Credenciales incorrectas. Intenta de nuevo.');
        Swal.fire({
            title: 'Error!',
            text: 'Credenciales incorrectas. Intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
} else {
    console.error('Por favor, complete todos los campos requeridos.');
}
} */
}
