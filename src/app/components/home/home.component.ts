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
 
 
        
      
        onSubmit() {
<<<<<<< HEAD
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
         /*  getCuantiaPorcentaje(salario: number, semanas: number): number {
            // Valores base para el salario y las semanas (estos valores podrían cambiar según tu lógica)
            const basePorcentaje = 15.61; // Porcentaje base para Salario = 1400 y Semanas = 1400
            const salarioBase = 1400;
            const semanasBase = 1400;
          
            // Cálculo del ajuste para el salario y las semanas (proporcional)
            const ajustePorSalario = (salario - salarioBase) / salarioBase;
            const ajustePorSemanas = (semanas - semanasBase) / semanasBase;
          
            // Ajuste combinado para el porcentaje de Cuantía Básica
            // Este factor se puede ajustar según los datos reales
            const porcentajeDecremento = 2.61 * (ajustePorSalario + ajustePorSemanas);
          
            // Cálculo final del porcentaje de Cuantía Básica
            let cuantiaPorcentaje = basePorcentaje - porcentajeDecremento;
          
            // Asegurarse de que el porcentaje no sea negativo
            return cuantiaPorcentaje < 0 ? 0 : cuantiaPorcentaje;
          }
          getIncrementoPorcentaje(salario: number, semanas: number): number {
            // Valores base para el incremento
            const baseIncremento = 2.38; // Porcentaje base para Salario = 1400 y Semanas = 1400
            const salarioBase = 1400;
            const semanasBase = 1400;
          
            // Cálculo del ajuste para el salario y las semanas (proporcional)
            const ajustePorSalario = (salario - salarioBase) / salarioBase;
            const ajustePorSemanas = (semanas - semanasBase) / semanasBase;
          
            // Ajuste combinado para el porcentaje de Incremento
            // Este factor se puede ajustar según los datos reales
            const porcentajeDecremento = 0.07 * (ajustePorSalario + ajustePorSemanas);
          
            // Cálculo final del porcentaje de Incremento
            let incrementoPorcentaje = baseIncremento + porcentajeDecremento;
          
            // Asegurarse de que el porcentaje no sea negativo
            return incrementoPorcentaje < 0 ? 0 : incrementoPorcentaje;
          }
          onSubmit() {
            // Obtener los valores del formulario
            const salario = this.cotizacionForm.value.salarioDiarioPromedio;
            const semanas = this.cotizacionForm.value.semanasCotizadas;           
            const esposa = this.cotizacionForm.value.esposa;
            const hijosMenoresEstudiando = this.cotizacionForm.value.hijosMenoresEstudiando;
            const padres = this.cotizacionForm.value.padres;
            const edadJubilacion = this.cotizacionForm.value.edadJubilacion;
          
            // Calcular los porcentajes de Cuantía y Incremento
            const basePorcentaje = this.getCuantiaPorcentaje(salario, semanas);
            const incrementoPorcentaje = this.getIncrementoPorcentaje(salario, semanas);
          
            // Lógica de cálculo de la pensión
            const cuantiaBaseAnual = salario * basePorcentaje / 100 * 365;
            const incrementoAnual = salario * incrementoPorcentaje / 100 * 365;
            const cuantiaAnualPension = cuantiaBaseAnual + incrementoAnual;
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
          
            console.log('Base Porcentaje:', basePorcentaje);
            console.log('Incremento Porcentaje:', incrementoPorcentaje);
            console.log('Cuantía Anual Base:', cuantiaBaseAnual);
            console.log('Incremento Anual:', incrementoAnual);
            console.log('Cuantía Total Anual:', cuantiaAnualPension);
          } */
           
          
            onSubmit(): void {
              if (this.cotizacionForm.valid) {
                const formValue = this.cotizacionForm.value;
                this.calcularPension(formValue);
              }
            }
          
            calcularPension(formValue: any): void {
              const { semanasCotizadas, salarioDiarioPromedio, esposa, hijosMenoresEstudiando, padres, edadJubilacion } = formValue;
          
              // Cálculo de la pensión anual por vejez
              const pensionAnualVejez = this.calcularPensionVejez(semanasCotizadas, salarioDiarioPromedio, esposa, hijosMenoresEstudiando, padres);
              this.pensionTotal = pensionAnualVejez;
              this.pensionTotalMensual = pensionAnualVejez / 12;
          
              // Cálculo de la pensión anual por cesantía en edad avanzada
              const pensionAnualCesantia = this.calcularPensionCesantia(semanasCotizadas, salarioDiarioPromedio, esposa, hijosMenoresEstudiando, padres, edadJubilacion);
              this.pensionCesantia = pensionAnualCesantia;
              this.pensionCesantiaMensual = pensionAnualCesantia / 12;
            }
          
            calcularPensionVejez(semanasCotizadas: number, salarioDiarioPromedio: number, esposa: string, hijosMenoresEstudiando: number, padres: string): number {
              // Lógica para calcular la pensión por vejez
              // Este es un ejemplo, ajusta según las reglas de cálculo reales
              let pension = salarioDiarioPromedio * 365; // Base anual
              if (esposa === 'si') {
                pension += pension * 0.15; // Aumento por esposa
              }
              if (hijosMenoresEstudiando > 0) {
                pension += pension * (0.10 * hijosMenoresEstudiando); // Aumento por hijos
              }
              if (padres === 'si') {
                pension += pension * 0.10; // Aumento por padres
              }
              return pension;
            }
          
            calcularPensionCesantia(semanasCotizadas: number, salarioDiarioPromedio: number, esposa: string, hijosMenoresEstudiando: number, padres: string, edadJubilacion: number): number {
              // Lógica para calcular la pensión por cesantía en edad avanzada
              // Este es un ejemplo, ajusta según las reglas de cálculo reales
              let pension = salarioDiarioPromedio * 365; // Base anual
              if (esposa === 'si') {
                pension += pension * 0.15; // Aumento por esposa
              }
              if (hijosMenoresEstudiando > 0) {
                pension += pension * (0.10 * hijosMenoresEstudiando); // Aumento por hijos
              }
              if (padres === 'si') {
                pension += pension * 0.10; // Aumento por padres
              }
              if (edadJubilacion < 65) {
                pension -= pension * 0.05; // Reducción por jubilación anticipada
              }
              return pension;
            }
          
           
            
            
            
         /*  onSubmit() {
            // Obtener los valores del formulario
            const semanasCotizadas = this.cotizacionForm.value.semanasCotizadas;
            const salarioDiarioPromedio = this.cotizacionForm.value.salarioDiarioPromedio;
            const esposa = this.cotizacionForm.value.esposa;
            const hijosMenoresEstudiando = this.cotizacionForm.value.hijosMenoresEstudiando;
            const padres = this.cotizacionForm.value.padres;
            const edadJubilacion = this.cotizacionForm.value.edadJubilacion;
          
            // Cálculos
            const cuantiaBasicaAnual = salarioDiarioPromedio * 0.1829 * 365;
            const incrementoAnual = salarioDiarioPromedio * 0.0230 * 365 * 13.5;
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
            const pensionCesantiaAnual = pensionVejezAnual * 0.100;
          
            // Mostrar resultados
            this.pensionTotal = pensionVejezAnual;
            this.pensionCesantia = pensionCesantiaAnual;
          
            // Calcular mensuales
            this.pensionTotalMensual = pensionVejezAnual / 12;
            this.pensionCesantiaMensual = pensionCesantiaAnual / 12;
          } */
          
=======
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
>>>>>>> parent of fde25f4 (funciona pero con valor fijo)
        
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
