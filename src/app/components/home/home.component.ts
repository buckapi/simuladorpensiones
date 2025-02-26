import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
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
  cotizacionForm: FormGroup;
  pensionTotal: number = 0;
  pensionCesantia: number = 0;
  pdfGenerable: boolean = false;

  constructor(private fb: FormBuilder) { 
    this.cotizacionForm = this.fb.group({
      semanasCotizadas: [null, [Validators.required, Validators.min(0)]],
      salarioDiarioPromedio: [null, [Validators.required, Validators.min(0)]],
      hijosMenoresEstudiando: [null, [Validators.required, Validators.min(0)]],
      edadJubilacion: [null, [Validators.required, Validators.min(60)]],
      esposa: [null],  // Si tiene esposa (opcional)
      padres: [null],  // Si tiene padres (opcional)
    });
  }

  ngOnInit(): void {
 /*    setTimeout(() => {
      const modalElement = document.getElementById('infoModal');
      if (modalElement) {
          const modal = new window.bootstrap.Modal(modalElement); // Asegúrate de que esto esté correcto
          modal.show();
      }
  }, 1000); */
    this.cotizacionForm = this.fb.group({
      semanasCotizadas: [null, [Validators.required, Validators.min(0)]],
      salarioDiarioPromedio: [null, [Validators.required, Validators.min(0)]],
      hijosMenoresEstudiando: [null, [Validators.required, Validators.min(0)]],
      edadJubilacion: [null, [Validators.required, Validators.min(60)]],
      esposa: [null],  // Si tiene esposa (opcional)
      padres: [null],  // Si tiene padres (opcional)
    });
  }
/* onSubmit() {
  if (this.cotizacionForm.valid) {
    this.calcularPension();
  }
} */
  limpiar() {
    this.cotizacionForm.reset();
    this.pensionTotal = 0;
    this.pensionCesantia = 0;
  }
 
  onSubmit() {
    if (this.cotizacionForm.valid) {
        console.log(this.cotizacionForm.value);  // Verifica los valores capturados.
        this.calcularPension();
    } else {
        console.log("Formulario no válido");
    }
    } 
/*   calcularPension() {
    const formData = this.cotizacionForm.value;
    console.log(formData);  // Verifica los datos del formulario
  
    // Variables necesarias para el cálculo
    const salarioMinimo = 278.88;
    const incrementoCuantiaBasica = 0.0236;
    const porcentajeViuda = 0.15;
    const porcentajeHijos = 0.10;
    const porcentajePadres = 0.20;
  
    // Datos del formulario
    const semanasCotizadas = formData.semanasCotizadas;
    const salarioDiarioPromedio = formData.salarioDiarioPromedio;
    const hijosMenoresEstudiando = formData.hijosMenoresEstudiando;
    const edadJubilacion = formData.edadJubilacion;
    const tieneEsposa = formData.esposa === 'si';
    const tienePadres = formData.padres > 0;
  
    console.log('Salario Diario Promedio:', salarioDiarioPromedio);
    console.log('Semanas Cotizadas:', semanasCotizadas);
    console.log('Hijos Menores o Estudiando:', hijosMenoresEstudiando);
    console.log('Edad Jubilación:', edadJubilacion);
    console.log('Tiene esposa:', tieneEsposa);
    console.log('Tiene padres:', tienePadres);
  
    // 1. Cuantía básica anual
    const cuantiaDiaria = salarioDiarioPromedio * 0.1641;  // 16.41% del salario diario
    const cuantiaBasicaAnual = cuantiaDiaria * 365;
  
    // 2. Incremento anual a la cuantía básica
    const incrementoDiario = salarioDiarioPromedio * incrementoCuantiaBasica;
    const incrementoAnual = incrementoDiario * 365;
  
    // 3. Cuantía anual de la pensión
    let cuantiaAnualPension = cuantiaBasicaAnual + incrementoAnual;
  
    // 4. Ayudas
  
    // Ayuda esposa (si aplica)
    let ayudaEsposa = 0;
    if (tieneEsposa) {
      ayudaEsposa = cuantiaAnualPension * porcentajeViuda;
    }
  
    // Ayuda hijos menores o estudiando (si aplica)
    let ayudaHijos = 0;
    if (hijosMenoresEstudiando > 0) {
      ayudaHijos = cuantiaAnualPension * porcentajeHijos * hijosMenoresEstudiando;
    }
  
    // Ayuda padres (si aplica)
    let ayudaPadres = 0;
    if (tienePadres) {
      ayudaPadres = cuantiaAnualPension * porcentajePadres * formData.padres;
    }
  
    // 5. Total de ayudas
    const totalAyudas = ayudaEsposa + ayudaHijos + ayudaPadres;
  
    // 6. Cuantía total de la pensión
    const pensionTotalCalculada = cuantiaAnualPension + totalAyudas;
  
    // 7. Pensión por vejez (con incremento del 11%)
    const pensionConIncremento = pensionTotalCalculada * 1.11;
  
    // 8. Pensión por cesantía (75% de la pensión por vejez)
    const pensionCesantiaCalculada = pensionConIncremento * 0.75;
  
    // Asignamos los resultados para mostrarlos en la vista
    this.pensionTotal = pensionConIncremento;
    this.pensionCesantia = pensionCesantiaCalculada;
  
    console.log(`Pensión total anual por vejez: $${this.pensionTotal.toFixed(2)}`);
    console.log(`Pensión total anual por cesantía: $${this.pensionCesantia.toFixed(2)}`);
  } */
  
    calcularPension() {
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
  }
/*   generarPDF() {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text('SIMULADOR PENSION POR CESANTÍA O VEJEZ', 20, 20);
    doc.setFontSize(12);

    // Ley IMSS
    doc.text('LEY 1973 IMSS', 20, 30);

    // Información del trabajador
    doc.text('No. Semanas Cotizadas: 1520', 20, 40);
    doc.text('Salario Diario Promedio (últimas 250 Semanas): $1,350.00', 20, 50);
    doc.text('Esposa: Si', 20, 60);
    doc.text('Hijos Menores o Estudiando: 1', 20, 70);
    doc.text('Padres: 0', 20, 80);
    doc.text('Edad Jubilación: 60', 20, 90);

  
    doc.text('Salario Diario Promedio en veces salario mínimo (VSM): $4.84', 20, 110);

    // Títulos de los conceptos
    doc.setFontSize(14);
    doc.text('Concepto', 20, 120);
    doc.text('Anual', 120, 120);
    doc.text('Mes', 160, 120);

    // Cuantía Básica
    doc.setFontSize(12);
    doc.text('Cuantía Básica', 20, 130);
    doc.text('$80,860.28', 120, 130);
    doc.text('$6,738.36', 160, 130);

    // Incremento Anual
    doc.text('Incremento Anual a la Cuantía Básica', 20, 140);
    doc.text('$232,085.25', 120, 140);
    doc.text('$19,340.44', 160, 140);

    // Cuantía Anual de la Pensión
    doc.text('Cuantía Anual de la Pensión', 20, 150);
    doc.text('$312,945.53', 120, 150);
    doc.text('$26,078.79', 160, 150);

    // Ayuda Asignación Esposa
    doc.text('Ayuda Asignación Esposa', 20, 160);
    doc.text('$46,941.83', 120, 160);
    doc.text('$3,911.82', 160, 160);

    // Ayuda Hijos Menores o Estudiando
    doc.text('Ayuda Hijos Menores o Estudiando', 20, 170);
    doc.text('$31,294.55', 120, 170);
    doc.text('$2,607.88', 160, 170);

    // Ayuda Padres
    doc.text('Ayuda Padres', 20, 180);
    doc.text('$0.00', 120, 180);
    doc.text('$0.00', 160, 180);

    // Ayuda x Soledad
    doc.text('Ayuda x Soledad', 20, 190);
    doc.text('$0.00', 120, 190);
    doc.text('$0.00', 160, 190);

    // Cuantía Anual de la Pensión + Ayudas
    doc.text('Cuantía Anual de la Pensión + Ayudas', 20, 200);
    doc.text('$391,181.91', 120, 200);
    doc.text('$32,598.49', 160, 200);

    // Pensión Anual x Vejez
    doc.text('Pensión Anual x Vejez', 20, 210);
    doc.text('$434,211.92', 120, 210);
    doc.text('$36,184.33', 160, 210);

    // Pensión Anual x Cesantía en Edad Avanzada
    doc.text('Pensión Anual x Cesantía en Edad Avanzada', 20, 220);
    doc.text('$325,658.94', 120, 220);
    doc.text('$27,138.24', 160, 220);

    // Guardar el PDF
    doc.save('simulador_pension.pdf');
  } */
  generarPDF() {
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

    // Títulos de los conceptos
    doc.setFontSize(14);
    doc.text('Concepto', 20, 120);
    doc.text('Anual', 120, 120);
    doc.text('Mes', 160, 120);

    // Cuantía Básica
    doc.setFontSize(12);
    doc.text('Cuantía Básica', 20, 130);
    doc.text('$80,860.28', 120, 130);
    doc.text('$6,738.36', 160, 130);

    // Incremento Anual
    doc.text('Incremento Anual a la Cuantía Básica', 20, 140);
    doc.text('$232,085.25', 120, 140);
    doc.text('$19,340.44', 160, 140);

    // Cuantía Anual de la Pensión
    doc.text('Cuantía Anual de la Pensión', 20, 150);
    doc.text('$312,945.53', 120, 150);
    doc.text('$26,078.79', 160, 150);

    // Ayuda Asignación Esposa
    doc.text('Ayuda Asignación Esposa', 20, 160);
    doc.text('$46,941.83', 120, 160);
    doc.text('$3,911.82', 160, 160);

    // Ayuda Hijos Menores o Estudiando
    doc.text('Ayuda Hijos Menores o Estudiando', 20, 170);
    doc.text('$31,294.55', 120, 170);
    doc.text('$2,607.88', 160, 170);

    // Ayuda Padres
    doc.text('Ayuda Padres', 20, 180);
    doc.text('$0.00', 120, 180);
    doc.text('$0.00', 160, 180);

    // Ayuda x Soledad
    doc.text('Ayuda x Soledad', 20, 190);
    doc.text('$0.00', 120, 190);
    doc.text('$0.00', 160, 190);

    // Cuantía Anual de la Pensión + Ayudas
    doc.text('Cuantía Anual de la Pensión + Ayudas', 20, 200);
    doc.text('$391,181.91', 120, 200);
    doc.text('$32,598.49', 160, 200);

    // Pensión Anual x Vejez
    doc.text('Pensión Anual x Vejez', 20, 210);
    doc.text('$434,211.92', 120, 210);
    doc.text('$36,184.33', 160, 210);

    // Pensión Anual x Cesantía en Edad Avanzada
    doc.text('Pensión Anual x Cesantía en Edad Avanzada', 20, 220);
    doc.text('$325,658.94', 120, 220);
    doc.text('$27,138.24', 160, 220);
    // Guardar el PDF
    doc.save('simulador_pension.pdf');
}


}
