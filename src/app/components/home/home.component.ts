import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import { GlobalService } from '../../services/global.service';
/* import * as bootstrap from 'bootstrap';
 */
/* import { global } from 'bootstrap'; */

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
/*   loginForm: FormGroup; 
 */  cotizacionForm: FormGroup;
  pensionTotal: number = 0;
  pensionCesantia: number = 0;
  pdfGenerable: boolean = false;
  mostrarFormulario: boolean = false;
  cuantiaBasicaAnual: number = 0;   
  cuantiaBasicaCesantia: number = 0;
  cuantiaBasicaVejez: number = 0;
  cuantiaBasicaHijos: number = 0;
  cuantiaBasicaVejezHijos: number = 0;
  incrementoAnual: number = 0;
  cuantiaAnualPension: number = 0;
  ayudaPension: number = 0;
  ayudaEsposa: number = 0;
  ayudaPadres: number = 0;
  ayudaHijos: number = 0;
  ayudaVejez: number = 0;
  cuantiaAnualPensionConAyudas: number = 0;

  constructor(private fb: FormBuilder,
    public global: GlobalService,
    public auth: AuthPocketbaseService
  ) { 
    this.cotizacionForm = this.fb.group({
      semanasCotizadas: [null, [Validators.required, Validators.min(0)]],
      salarioDiarioPromedio: [null, [Validators.required, Validators.min(0)]],
      hijosMenoresEstudiando: [null, [Validators.required, Validators.min(0)]],
      edadJubilacion: [null, [Validators.required, Validators.min(60)]],
      esposa: [null],  // Si tiene esposa (opcional)
      padres: [null],  // Si tiene padres (opcional)
    });
   /*  this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
  }); */
  }

  ngOnInit(): void {

    this.cotizacionForm = this.fb.group({
      /* name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]], */
      semanasCotizadas: [null, [Validators.required, Validators.min(0)]],
      salarioDiarioPromedio: [null, [Validators.required, Validators.min(0)]],
      hijosMenoresEstudiando: [null, [Validators.required, Validators.min(0)]],
      edadJubilacion: [null, [Validators.required, Validators.min(60)]],
      esposa: [null],  // Si tiene esposa (opcional)
      padres: [null],  // Si tiene padres (opcional)
    });
  
  }
 
  mostrarFormularioFn() {
    this.mostrarFormulario = true;
  }
  limpiar() {
    this.cotizacionForm.reset();
    this.pensionTotal = 0;
    this.pensionCesantia = 0;
  }
 
  onSubmit() {
    if (this.cotizacionForm.valid) {
        this.calcularPension(); // Asegúrate de que esta línea esté presente
    } else {
        console.log("Formulario no válido");
    }
}
   /*  loginUser() {
      if (this.loginForm.valid) {
          const { email, password } = this.loginForm.value;
          this.auth.loginUser(email, password).subscribe(
              (response) => {
                  console.log('Inicio de sesión exitoso', response);
                  this.global.setRoute('home'); // Redirigir a la página de inicio
              },
              (error) => {
                  console.error('Error al iniciar sesión', error);
              }
          );
      } else {
          console.error('Por favor, complete todos los campos requeridos.');
      }
  }

  // Método para registrar usuario
  registerUser() {
      if (this.cotizacionForm.valid) {
          const { username, email, password } = this.cotizacionForm.value;
          this.auth.registerUser(email, password, 'cliente', username, '').subscribe(
              (response) => {
                  console.log('Usuario registrado exitosamente', response);
                  this.loginAfterRegistration(email, password);
              },
              (error) => {
                  console.error('Error al registrar usuario', error);
              }
          );
      } else {
          console.error('Por favor, complete todos los campos requeridos.');
      }
  }

  // Método para iniciar sesión después del registro
  loginAfterRegistration(email: string, password: string) {
      this.auth.loginUser(email, password).subscribe(
          (response) => {
              console.log('Inicio de sesión exitoso', response);
              this.global.setRoute('home'); // O la ruta que desees después del inicio de sesión
          },
          (error) => {
              console.error('Error al iniciar sesión después del registro', error);
              this.global.setRoute('home'); // Redirigir al login en caso de error
          }
      );
  } */
  /*   calcularPension() {
    const formData = this.cotizacionForm.value;
    console.log(formData);  // Verifica los datos del formulario
   
    // Variables necesarias para el cálculo
    const salarioDiarioPromedio = formData.salarioDiarioPromedio;
    const semanasCotizadas = formData.semanasCotizadas;
    const hijosMenoresEstudiando = formData.hijosMenoresEstudiando;
    const tieneEsposa = formData.esposa === 'si';
    const tienePadres = formData.padres > 0;
    const edadJubilacion = formData.edadJubilacion;
    
    console.log('Salario Diario Promedio:', salarioDiarioPromedio);
    console.log('Semanas Cotizadas:', semanasCotizadas);
    console.log('Hijos Menores o Estudiando:', hijosMenoresEstudiando);
    console.log('Edad Jubilación:', edadJubilacion);
    console.log('Tiene esposa:', tieneEsposa);
    console.log('Tiene padres:', tienePadres);
    console.log('Edad de Jubilación:', edadJubilacion);
  
    // 1. Cuantía Básica Anual
    const cuantiaDiaria = salarioDiarioPromedio * 0.1641;
    const cuantiaBasicaAnual = cuantiaDiaria * 365;
  
    // 2. Incremento Anual a la Cuantía Básica
    const incrementoDiario = salarioDiarioPromedio * 0.0236;
    const incrementoAnual = incrementoDiario * 365;
    const incrementoAnualCuantiaBasica = incrementoAnual * 20;  // 20 años adicionales
  
    // 3. Cuantía Anual de la Pensión
    const cuantiaAnualPension = cuantiaBasicaAnual + incrementoAnualCuantiaBasica;
  
    // 4. Ayudas
    let ayudaEsposa = 0;
    if (tieneEsposa) {
      ayudaEsposa = cuantiaAnualPension * 0.15;
    }
  
    let ayudaHijos = 0;
    if (hijosMenoresEstudiando > 0) {
      ayudaHijos = cuantiaAnualPension * 0.10 * hijosMenoresEstudiando;
    }
  
    let ayudaPadres = 0;
    if (tienePadres) {
      ayudaPadres = cuantiaAnualPension * 0.20 * formData.padres;
    }
  
    // 5. Total de ayudas
    const totalAyudas = ayudaEsposa + ayudaHijos + ayudaPadres;
  
    // 6. Cuantía Anual de la Pensión + Ayudas
    const pensionTotalCalculada = cuantiaAnualPension + totalAyudas;
  
    // 7. Pensión por Vejez (con incremento del 11%)
    const pensionConIncremento = pensionTotalCalculada * 1.11;
  
    // 8. Pensión por Cesantía (75% de la pensión por vejez)
    const pensionCesantiaCalculada = pensionConIncremento * 0.75;
  
    // Asignamos los resultados para mostrarlos en la vista
    this.pensionTotal = pensionConIncremento;
    this.pensionCesantia = pensionCesantiaCalculada;

    this.pdfGenerable=true;
  
    console.log(`Pensión total anual por vejez: $${this.pensionTotal.toFixed(2)}`);
    console.log(`Pensión total anual por cesantía: $${this.pensionCesantia.toFixed(2)}`);
  } */
    calcularPension() {
      const formData = this.cotizacionForm.value; // Obtener los datos del formulario
      console.log(formData);  // Verifica los datos del formulario
  
      // Variables necesarias para el cálculo
      const salarioDiarioPromedio = formData.salarioDiarioPromedio;
      const semanasCotizadas = formData.semanasCotizadas;
      const hijosMenoresEstudiando = formData.hijosMenoresEstudiando;
      const tieneEsposa = formData.esposa === 'si';
      const tienePadres = formData.padres === 'si'; // Cambiado para reflejar el nuevo select
      const edadJubilacion = formData.edadJubilacion;
  
      console.log('Salario Diario Promedio:', salarioDiarioPromedio);
      console.log('Semanas Cotizadas:', semanasCotizadas);
      console.log('Hijos Menores o Estudiando:', hijosMenoresEstudiando);
      console.log('Edad Jubilación:', edadJubilacion);
      console.log('Tiene esposa:', tieneEsposa);
      console.log('Tiene padres:', tienePadres);
    
      // 1. Cuantía Básica Anual
      const cuantiaDiaria = salarioDiarioPromedio * 0.1641;
      const cuantiaBasicaAnual = cuantiaDiaria * 365;
    
      // 2. Incremento Anual a la Cuantía Básica
      const incrementoDiario = salarioDiarioPromedio * 0.0236;
      const incrementoAnual = incrementoDiario * 365;
      const incrementoAnualCuantiaBasica = incrementoAnual * 20;  // 20 años adicionales
    
      // 3. Cuantía Anual de la Pensión
      const cuantiaAnualPension = cuantiaBasicaAnual + incrementoAnualCuantiaBasica;
    
      // 4. Ayudas
      let ayudaEsposa = 0;
      if (tieneEsposa) {
          ayudaEsposa = cuantiaAnualPension * 0.15;
      }
    
      let ayudaHijos = 0;
      if (hijosMenoresEstudiando > 0) {
          ayudaHijos = cuantiaAnualPension * 0.10 * hijosMenoresEstudiando;
      }
    
      let ayudaPadres = 0;
      if (tienePadres) {
          ayudaPadres = cuantiaAnualPension * 0.20; // Cambiado para reflejar que es un sí/no
      }
    
      // 5. Total de ayudas
      const totalAyudas = ayudaEsposa + ayudaHijos + ayudaPadres;
    
      // 6. Cuantía Anual de la Pensión + Ayudas
      const pensionTotalCalculada = cuantiaAnualPension + totalAyudas;
    
      // 7. Pensión por Vejez (con incremento del 11%)
      const pensionConIncremento = pensionTotalCalculada * 1.11;
    
      // 8. Pensión por Cesantía (75% de la pensión por vejez)
      const pensionCesantiaCalculada = pensionConIncremento * 0.75;
    
      // Asignamos los resultados para mostrarlos en la vista
      this.pensionTotal = pensionConIncremento;
      this.pensionCesantia = pensionCesantiaCalculada;
  
      this.pdfGenerable = true;
    
      console.log(`Pensión total anual por vejez: $${this.pensionTotal.toFixed(2)}`);
      console.log(`Pensión total anual por cesantía: $${this.pensionCesantia.toFixed(2)}`);
  }
    /* generarPDF() {
    const formData = this.cotizacionForm.value; // Obtener los datos del formulario
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text('SIMULADOR PENSION POR CESANTÍA O VEJEZ', 20, 20);
    doc.setFontSize(12);
    // Ley IMSS
    doc.text('LEY 1973 IMSS', 20, 30);

    // Información del trabajador
    doc.text(`No. Semanas Cotizadas: ${formData.semanasCotizadas}`, 20, 40);
    doc.text(`Salario Diario Promedio: $${formData.salarioDiarioPromedio}`, 20, 50);
    doc.text(`Esposa: ${formData.esposa}`, 20, 60);
    doc.text(`Hijos Menores o Estudiando: ${formData.hijosMenoresEstudiando}`, 20, 70);
    doc.text(`Padres: ${formData.padres}`, 20, 80);
    doc.text(`Edad Jubilación: ${formData.edadJubilacion}`, 20, 90);

    // Agregar más contenido al PDF según sea necesario...
    doc.text('Salario Diario Promedio en veces salario mínimo (VSM): $4.84', 20, 110); 

    doc.setFontSize(14);
    doc.text('Concepto', 20, 120);
    doc.text('Anual', 120, 120);
    doc.text('Mes', 160, 120);

    doc.setFontSize(12);
    doc.text('Cuantía Básica', 20, 130);
    doc.text('$', 120, 130);
    doc.text('$6,738.36', 160, 130);

    doc.text('Incremento Anual a la Cuantía Básica', 20, 140);
    doc.text('$232,085.25', 120, 140);
    doc.text('$19,340.44', 160, 140);

    doc.text('Cuantía Anual de la Pensión', 20, 150);
    doc.text('$312,945.53', 120, 150);
    doc.text('$26,078.79', 160, 150);

    doc.text('Ayuda Asignación Esposa', 20, 160);
    doc.text('$46,941.83', 120, 160);
    doc.text('$3,911.82', 160, 160);

    doc.text('Ayuda Hijos Menores o Estudiando', 20, 170);
    doc.text('$31,294.55', 120, 170);
    doc.text('$2,607.88', 160, 170);

    doc.text('Ayuda Padres', 20, 180);
    doc.text('$0.00', 120, 180);
    doc.text('$0.00', 160, 180);

    doc.text('Ayuda x Soledad', 20, 190);
    doc.text('$0.00', 120, 190);
    doc.text('$0.00', 160, 190);

    doc.text('Cuantía Anual de la Pensión + Ayudas', 20, 200);
    doc.text('$391,181.91', 120, 200);
    doc.text('$32,598.49', 160, 200);

    doc.text('Pensión Anual x Vejez', 20, 210);
    doc.text('$434,211.92', 120, 210);
    doc.text('$36,184.33', 160, 210);

    doc.text('Pensión Anual x Cesantía en Edad Avanzada', 20, 220);
    doc.text('$325,658.94', 120, 220);
    doc.text('$27,138.24', 160, 220);
    doc.save('simulador_pension.pdf');
} */


    // Generar PDF con estilo bonito
generarPDF() {
  const formData = this.cotizacionForm.value; // Obtener los datos del formulario
  const doc = new jsPDF();

  // Establecer fuente base
  doc.setFont("Helvetica", "normal");

  // Título principal
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0); // Negro para el título
  doc.text('SIMULADOR PENSION POR CESANTÍA O VEJEZ', 20, 20);
  
  // Subtítulo
  doc.setFontSize(14);
  doc.setTextColor(128, 128, 128); // Gris para el subtítulo
  doc.text('LEY 1973 IMSS', 20, 30);

  // Línea separadora
doc.setDrawColor(255, 0, 0); // Rojo para la línea
doc.line(20, 32, 200, 32);

  // Sección de información del trabajador
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Negro para texto general
  doc.text(`No. Semanas Cotizadas: ${formData.semanasCotizadas}`, 20, 40);
  doc.text(`Salario Diario Promedio: $${formData.salarioDiarioPromedio}`, 20, 50);
  doc.text(`Esposa: ${formData.esposa}`, 20, 60);
  doc.text(`Hijos Menores o Estudiando: ${formData.hijosMenoresEstudiando}`, 20, 70);
  doc.text(`Padres: ${formData.padres}`, 20, 80);
  doc.text(`Edad Jubilación: ${formData.edadJubilacion}`, 20, 90);

  // Títulos de los conceptos
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0); // Títulos en azul
  doc.text('Concepto', 20, 110);
  doc.text('Anual', 120, 110);
  doc.text('Mes', 160, 110);

  // Cuantía Básica (celdas con bordes)
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Texto negro
  doc.text('Cuantía Básica', 20, 120);
  doc.text('$6,738.36', 120, 120);
  doc.text('$561.53', 160, 120);

  // Incremento Anual
  doc.text('Incremento Anual a la Cuantía Básica', 20, 130);
  doc.text('$232,085.25', 120, 130);
  doc.text('$19,340.44', 160, 130);

  // Cuantía Anual de la Pensión
  doc.text('Cuantía Anual de la Pensión', 20, 140);
  doc.text('$312,945.53', 120, 140);
  doc.text('$26,078.79', 160, 140);

  // Ayuda Asignación Esposa
  doc.text('Ayuda Asignación Esposa', 20, 150);
  doc.text('$46,941.83', 120, 150);
  doc.text('$3,911.82', 160, 150);

  // Ayuda Hijos Menores o Estudiando
  doc.text('Ayuda Hijos Menores o Estudiando', 20, 160);
  doc.text('$31,294.55', 120, 160);
  doc.text('$2,607.88', 160, 160);

  // Ayuda Padres
  doc.text('Ayuda Padres', 20, 170);
  doc.text('$0.00', 120, 170);
  doc.text('$0.00', 160, 170);

  // Ayuda x Soledad
  doc.text('Ayuda x Soledad', 20, 180);
  doc.text('$0.00', 120, 180);
  doc.text('$0.00', 160, 180);

  // Cuantía Anual de la Pensión + Ayudas
  doc.text('Cuantía Anual de la Pensión + Ayudas', 20, 190);
  doc.text('$391,181.91', 120, 190);
  doc.text('$32,598.49', 160, 190);

  // Pensión Anual x Vejez (subrayado en amarillo con fondo)
  const vejezY = 200;
  doc.setFontSize(12);
  doc.text('Pensión Anual x Vejez', 20, vejezY);
  doc.text(`$${this.pensionTotal.toFixed(2)}`, 120, vejezY);
  doc.text(`$${(this.pensionTotal / 12).toFixed(2)}`, 160, vejezY);

  // Subrayado en amarillo
  doc.setDrawColor(255, 255, 0); // Color amarillo
  doc.line(20, vejezY + 4, 180, vejezY + 4); // Dibuja la línea de subrayado

  // Pensión Anual x Cesantía en Edad Avanzada (subrayado en verde con fondo)
  const cesantiaY = 210;
  doc.text('Pensión Anual x Cesantía en Edad Avanzada', 20, cesantiaY);
  doc.text(`$${this.pensionCesantia.toFixed(2)}`, 120, cesantiaY);
  doc.text(`$${(this.pensionCesantia / 12).toFixed(2)}`, 160, cesantiaY);

  // Subrayado en verde
  doc.setDrawColor(0, 128, 0); // Color verde
  doc.line(20, cesantiaY + 4, 180, cesantiaY + 4); // Dibuja la línea de subrayado

 
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(169, 169, 169); // Gris para el pie de página
  doc.text('Simulador generado por el sistema', 20, doc.internal.pageSize.height - 10);

  // Guardar el PDF
  doc.save('simulador_pension.pdf');
}

    
  }
