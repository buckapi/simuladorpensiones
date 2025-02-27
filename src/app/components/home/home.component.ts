import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2'; // Asegúrate de importar SweetAlert
import * as bootstrap from 'bootstrap'; // Importa Bootstrap



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
  pensionCesantiaMensual: number = 0;
  pensionTotalMensual: number = 0;
  pdfGenerable: boolean = false;


  constructor(private fb: FormBuilder,
    public global: GlobalService,
    public auth: AuthPocketbaseService,
    
  ) { 

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
      /* name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]], */
    /* this.cotizacionForm = this.fb.group({

      semanasCotizadas: [null, [Validators.required, Validators.min(0)]],
      salarioDiarioPromedio: [null, [Validators.required, Validators.min(0)]],
      hijosMenoresEstudiando: [null, [Validators.required, Validators.min(0)]],
      edadJubilacion: [null, [Validators.required, Validators.min(60)]],
      esposa: [null],  // Si tiene esposa (opcional)
      padres: [null],  // Si tiene padres (opcional)
    }); */
   /*  this.cotizacionForm = this.fb.group({
      semanasCotizadas: [null, [Validators.required, Validators.min(1)]], // Permite ingresar cualquier valor
      salarioDiarioPromedio: [null, [Validators.required, Validators.min(1)]], // Permite ingresar cualquier valor
      esposa: ['null', [Validators.required]], // Valor predeterminado
      hijosMenoresEstudiando: [0],
      padres: ['null'],
      edadJubilacion: [60, [Validators.required]]
    }); */
    this.cotizacionForm = this.fb.group({
      semanasCotizadas: [null, [Validators.required, Validators.min(1)]], // Permite ingresar cualquier valor
      salarioDiarioPromedio: [null, [Validators.required, Validators.min(1)]], // Permite ingresar cualquier valor
      esposa: ['no', [Validators.required]], // Valor predeterminado
      hijosMenoresEstudiando: [0],
      padres: ['no'],
      edadJubilacion: [60, [Validators.required]]
    });
  
  }
 
 
 /*  limpiar() {
    this.cotizacionForm.reset();
    this.pensionTotal = 0;
    this.pensionCesantia = 0;
  } */
 
 /*  onSubmit() {
    if (this.cotizacionForm.valid) {
        this.calcularPension(); // Asegúrate de que esta línea esté presente
    } else {
        console.log("Formulario no válido");
    }
}

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
        const cuantiaDiaria = salarioDiarioPromedio * 0.1561;
        const cuantiaBasicaAnual = cuantiaDiaria * 365;  // Cuantía básica anual
      
        // 2. Incremento Anual a la Cuantía Básica
        const incrementoDiario = salarioDiarioPromedio * 0.0236;
        const incrementoAnual = incrementoDiario * 365;
        const incrementoAnualCuantiaBasica = incrementoAnual * 20;  // 20 años adicionales
        
        // 3. Cuantía Anual de la Pensión
        const cuantiaAnualPension = cuantiaBasicaAnual + incrementoAnualCuantiaBasica;
      
        // 4. Ayudas
        let ayudaEsposa = 0;
        if (tieneEsposa) {
            ayudaEsposa = cuantiaAnualPension * 0.15;  // 15% de la cuantía anual
        }
    
        let ayudaHijos = 0;
        if (hijosMenoresEstudiando > 0) {
            ayudaHijos = cuantiaAnualPension * 0.10 * hijosMenoresEstudiando; // 10% por cada hijo
        }
    
        let ayudaPadres = 0;
        if (tienePadres) {
            ayudaPadres = cuantiaAnualPension * 0.20;  // 20% si aplica
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
    
        // Resultados en consola para verificar
        console.log(`Pensión total anual por vejez: $${this.pensionTotal.toFixed(2)}`);
        console.log(`Pensión total anual por cesantía: $${this.pensionCesantia.toFixed(2)}`);
    } */
        
       /*  calcularPorcentajes(salario: number, semanas: number): { basePorcentaje: number, incrementoPorcentaje: number } {
          let basePorcentaje: number;
          let incrementoPorcentaje: number;
      
          // Condición donde salario y semanas son menores o iguales a 1400
          if (salario <= 1400 && semanas <= 1400) {
            basePorcentaje = 15.61;  // Si el salario y las semanas están por debajo de 1400
            incrementoPorcentaje = 2.38; // Incremento para este caso
          }
          // Condición donde salario y semanas son mayores a 1400
          else if (salario > 1400 && semanas > 1400) {
            basePorcentaje = 13.00;  // Si el salario y las semanas están por encima de 1400
            incrementoPorcentaje = 2.45; // Incremento para este caso
          }
          // Caso intermedio donde uno es mayor y el otro menor o igual a 1400
          else {
            basePorcentaje = 14.00;  // Valor por defecto para el caso intermedio
            incrementoPorcentaje = 2.40; // Incremento por defecto
          }
      
          return { basePorcentaje, incrementoPorcentaje };
        }
      
        // Función que se ejecuta al enviar el formulario
        onSubmit() {
          const salario = this.cotizacionForm.value.salarioDiarioPromedio;
          const semanas = this.cotizacionForm.value.semanasCotizadas;
      
          // Calcular los porcentajes
          const { basePorcentaje, incrementoPorcentaje } = this.calcularPorcentajes(salario, semanas);
      
          // Lógica de cálculo de las pensiones
          const cuantiaBaseAnual = salario * basePorcentaje / 100 * 365;
          const incrementoAnual = salario * incrementoPorcentaje / 100 * 365;
          const cuantiaTotalAnual = cuantiaBaseAnual + incrementoAnual;
      
          console.log('Base Porcentaje:', basePorcentaje);
          console.log('Incremento Porcentaje:', incrementoPorcentaje);
          console.log('Cuantía Anual Base:', cuantiaBaseAnual);
          console.log('Incremento Anual:', incrementoAnual);
          console.log('Cuantía Total Anual:', cuantiaTotalAnual);
        } */
      
          onSubmit() {
            // Obtener los valores del formulario
            const semanasCotizadas = this.cotizacionForm.value.semanasCotizadas;
            const salarioDiarioPromedio = this.cotizacionForm.value.salarioDiarioPromedio;
            const esposa = this.cotizacionForm.value.esposa;
            const hijosMenoresEstudiando = this.cotizacionForm.value.hijosMenoresEstudiando;
            const padres = this.cotizacionForm.value.padres;
            const edadJubilacion = this.cotizacionForm.value.edadJubilacion;
          
            // Cálculos
            const cuantiaBasicaAnual = salarioDiarioPromedio * 0.1561 * 365;
            const incrementoAnual = salarioDiarioPromedio * 0.0238 * 365 * 17.5;
            const cuantiaAnualPension = cuantiaBasicaAnual + incrementoAnual;
          
            // Ayuda por esposa (15%)
            const ayudaEsposa = esposa === 'si' ? cuantiaAnualPension * 0.15 : 0;
          
            // Ayuda por hijos y padres
            const ayudaHijos = hijosMenoresEstudiando > 0 ? cuantiaAnualPension * 0.10 : 0;
            const ayudaPadres = padres === 'si' ? cuantiaAnualPension * 0.20 : 0;
          
            // Cuantía total anual (con ayudas)
            const cuantiaTotalAnual = cuantiaAnualPension + ayudaEsposa + ayudaHijos + ayudaPadres;
          
            // Pensión Anual x Vejez con incremento del 11%
            const pensionVejezAnual = cuantiaTotalAnual * 1.11;
          
            // Pensión Anual x Cesantía en Edad Avanzada
            const pensionCesantiaAnual = pensionVejezAnual * 0.75;
          
            // Mostrar resultados
            this.pensionTotal = pensionVejezAnual;
            this.pensionCesantia = pensionCesantiaAnual;
          
            // Calcular mensuales
            this.pensionTotalMensual = pensionVejezAnual / 12;
            this.pensionCesantiaMensual = pensionCesantiaAnual / 12;
          }
          
        
        limpiar(): void {
          this.cotizacionForm.reset();
          this.pensionTotal = 0;
          this.pensionCesantia = 0;
          this.pensionTotalMensual = 0;
          this.pensionCesantiaMensual = 0;
          this.pdfGenerable = false;
        }
    
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
