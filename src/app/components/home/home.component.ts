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
  salario: number = 0;  // Aquí guardamos el valor del salario
  porcentajes: any;  // Aquí guardamos el resultado de la función obtenerPorcentajes
  rangos = [
    { de: 0, a: 1.00, cuantiaBasica: 0.80, incremento: 0.56 },
    { de: 1.01, a: 1.25, cuantiaBasica: 0.7711, incremento: 0.81 },
    { de: 1.26, a: 1.50, cuantiaBasica: 0.5518, incremento: 1.18 },
    { de: 1.51, a: 1.75, cuantiaBasica: 0.4923, incremento: 1.43 },
    { de: 1.76, a: 2.00, cuantiaBasica: 0.4267, incremento: 1.62 },
    { de: 2.01, a: 2.25, cuantiaBasica: 0.3765, incremento: 1.76 },
    { de: 2.26, a: 2.50, cuantiaBasica: 0.3368, incremento: 1.87 },
    { de: 2.51, a: 2.75, cuantiaBasica: 0.3048, incremento: 1.96 },
    { de: 2.76, a: 3.00, cuantiaBasica: 0.2783, incremento: 2.03 },
    { de: 3.01, a: 3.25, cuantiaBasica: 0.256, incremento: 2.10 },
    { de: 3.26, a: 3.50, cuantiaBasica: 0.237, incremento: 2.15 },
    { de: 3.51, a: 3.75, cuantiaBasica: 0.2207, incremento: 2.20 },
    { de: 3.76, a: 4.00, cuantiaBasica: 0.2065, incremento: 2.24 },
    { de: 4.01, a: 4.25, cuantiaBasica: 0.1939, incremento: 2.27 },
    { de: 4.26, a: 4.50, cuantiaBasica: 0.1829, incremento: 2.30 },
    { de: 4.51, a: 4.75, cuantiaBasica: 0.1730, incremento: 2.33 },
    { de: 4.76, a: 5.00, cuantiaBasica: 0.1641, incremento: 2.36 },
    { de: 5.01, a: 5.25, cuantiaBasica: 0.1561, incremento: 2.38 },
    { de: 5.26, a: 5.50, cuantiaBasica: 0.1488, incremento: 2.40 },
    { de: 5.51, a: 5.75, cuantiaBasica: 0.1422, incremento: 2.42 },
    { de: 5.76, a: 6.00, cuantiaBasica: 0.1362, incremento: 2.43 },
    { de: 6.01, a: Infinity, cuantiaBasica: 0.13, incremento: 2.45 }
  ];
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
  

    this.cotizacionForm = this.fb.group({
      semanasCotizadas: [null, [Validators.required, Validators.min(1)]], // Permite ingresar cualquier valor
      salarioDiarioPromedio: [null, [Validators.required, Validators.min(1)]], // Permite ingresar cualquier valor
      esposa: ['no', [Validators.required]], // Valor predeterminado
      hijosMenoresEstudiando: [0],
      padres: ['no'],
      edadJubilacion: [60, [Validators.required]]
    });
  
  }
 
 
obtenerPorcentajes(salarioDiarioPromedio: number) {
  for (let i = 0; i < this.rangos.length; i++) {
    if (salarioDiarioPromedio >= this.rangos[i].de && salarioDiarioPromedio <= this.rangos[i].a) {
      return {
        cuantiaBasicaPorcentaje: this.rangos[i].cuantiaBasica,
        incrementoPorcentaje: this.rangos[i].incremento
      };
    }
  }
  return {
    cuantiaBasicaPorcentaje: 0,
    incrementoPorcentaje: 0
  };
}

onSubmit() {
  // Obtener los valores del formulario
  const semanasCotizadas = this.cotizacionForm.value.semanasCotizadas;
  const salarioDiarioPromedio = this.cotizacionForm.value.salarioDiarioPromedio;
  const esposa = this.cotizacionForm.value.esposa;
  const hijosMenoresEstudiando = this.cotizacionForm.value.hijosMenoresEstudiando;
  const padres = this.cotizacionForm.value.padres;
  const edadJubilacion = this.cotizacionForm.value.edadJubilacion;

  // Obtener los porcentajes de la tabla de acuerdo al salario
  const { cuantiaBasicaPorcentaje, incrementoPorcentaje } = this.obtenerPorcentajes(salarioDiarioPromedio);

  // Calcular la Cuantía Básica Anual
  const cuantiaBasicaAnual = salarioDiarioPromedio * cuantiaBasicaPorcentaje * 365;

  // Calcular las semanas reconocidas posteriores a las primeras 500 semanas
  const semanasReconocidasPosteriores = semanasCotizadas - 500;
  
  // Calcular los años completos reconocidos posteriores a las 500 semanas
  const añosCompletosReconocidos = Math.floor(semanasReconocidasPosteriores / 52);

  // Calcular el Incremento Anual ajustado en función de los años completos
  const incrementoAnual = salarioDiarioPromedio * incrementoPorcentaje * 365 * añosCompletosReconocidos;

  // Calcular la Cuantía Anual de la Pensión
  const cuantiaAnualPension = cuantiaBasicaAnual + incrementoAnual;

  // Calcular las Ayudas
  // Ayuda por esposa (15%)
  const ayudaEsposa = esposa === 'si' ? cuantiaAnualPension * 0.15 : 0;

  // Ayuda por hijos menores o estudiando (10%)
  const ayudaHijos = hijosMenoresEstudiando > 0 ? cuantiaAnualPension * 0.10 : 0;

  // Ayuda por padres (20%) - Si aplica
  const ayudaPadres = padres === 'si' ? cuantiaAnualPension * 0.20 : 0;

  // Calcular la Cuantía Total Anual con Ayudas
  const cuantiaTotalAnual = cuantiaAnualPension + ayudaEsposa + ayudaHijos + ayudaPadres;

  // Calcular Pensión Anual por Vejez con el incremento del 11% (Art. Décimo)
  const pensionVejezAnual = cuantiaTotalAnual * 1.11;

  // Calcular Pensión Anual por Cesantía en Edad Avanzada (75% de la Pensión de Vejez)
  const pensionCesantiaAnual = pensionVejezAnual * 0.75;

  // Calcular el porcentaje de la pensión según la edad de jubilación
  let porcentajePensionEdad: number;

  // Asignar un valor a porcentajePensionEdad según la edad de jubilación
  if (edadJubilacion >= 65) {
    porcentajePensionEdad = 1.00;  // 100% para 65 años o más
  } else if (edadJubilacion === 64) {
    porcentajePensionEdad = 0.95;  // 95% para 64 años
  } else if (edadJubilacion === 63) {
    porcentajePensionEdad = 0.90;  // 90% para 63 años
  } else if (edadJubilacion === 62) {
    porcentajePensionEdad = 0.85;  // 85% para 62 años
  } else if (edadJubilacion === 61) {
    porcentajePensionEdad = 0.80;  // 80% para 61 años
  } else if (edadJubilacion === 60) {
    porcentajePensionEdad = 0.75;  // 75% para 60 años
  } else {
    // Asignamos un valor predeterminado si la edad no es válida
    porcentajePensionEdad = 0;  // Puedes ajustar esto según tus necesidades
  }

  // Aplicar el porcentaje según la edad de jubilación
  const pensionFinal = pensionVejezAnual * porcentajePensionEdad;

  // Mostrar los resultados de las pensiones y ayudas
  this.pensionTotal = pensionFinal;
  this.pensionCesantia = pensionCesantiaAnual;

  // Calcular las pensiones mensuales
  this.pensionTotalMensual = pensionFinal / 12;
  this.pensionCesantiaMensual = pensionCesantiaAnual / 12;

  // Puedes actualizar tu interfaz de usuario con estos valores.
  console.log('Pensión Total Anual:', this.pensionTotal);
  console.log('Pensión Cesantía Anual:', this.pensionCesantia);
  console.log('Pensión Total Mensual:', this.pensionTotalMensual);
  console.log('Pensión Cesantía Mensual:', this.pensionCesantiaMensual);
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
