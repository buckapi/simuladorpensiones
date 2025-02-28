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
  pensionTotalMensual: number = 0;
  pensionCesantia: number = 0;
  pensionCesantiaMensual: number = 0;
  pdfGenerable: boolean = false;
  constructor(private fb: FormBuilder,
    public global: GlobalService,
    public auth: AuthPocketbaseService,
    
  ) { 

    this.cotizacionForm = this.fb.group({
      semanasCotizadas: ['', Validators.required],
      salarioDiarioPromedio: ['', Validators.required],
      esposa: ['', Validators.required],
      hijosMenoresEstudiando: ['', Validators.required],
      padres: ['', Validators.required],
      edadJubilacion: ['', Validators.required]
    });
    
  }

  ngOnInit(): void {
    console.log(this.cotizacionForm);
  }
 
 

  onSubmit() {
    if (this.cotizacionForm.valid) {
        const formValue = this.cotizacionForm.value;
        const result = this.calculatePension(
            formValue.semanasCotizadas,
            formValue.salarioDiarioPromedio,
            formValue.esposa,
            formValue.hijosMenoresEstudiando,
            formValue.padres,
            formValue.edadJubilacion
        );

        this.pensionTotal = result.pensionAnualVejez;
        this.pensionTotalMensual = result.pensionMensualVejez;
        this.pensionCesantia = result.pensionCesantia;
        this.pensionCesantiaMensual = result.pensionCesantiaMensual;
        this.pdfGenerable = true;
        console.log(this.cotizacionForm.value);

    }
}

limpiar() {
  this.cotizacionForm.reset();
  this.pensionTotal = 0;
  this.pensionTotalMensual = 0;
  this.pensionCesantia = 0;
  this.pensionCesantiaMensual = 0;
  this.pdfGenerable = false;
}
// En tu archivo de servicio o directamente en el componente
calculatePension(semanasCotizadas: number, salarioDiarioPromedio: number, esposa: string, hijosMenoresEstudiando: number, padres: string, edadJubilacion: number) {
  const salarioMinimo = 278.88;
  const vsm = salarioDiarioPromedio / salarioMinimo;

  // Buscar Cuantía Básica e Incremento Anual en la tabla
  const { cuantiaBasica, incrementoAnual } = this.buscarEnTabla(vsm);

  // Calcular Cuantía Diaria y Cuantía Básica Anual (redondeado a 2 decimales)
  const cuantiaDiaria = Math.round((salarioDiarioPromedio * cuantiaBasica / 100) * 100) / 100;
  const cuantiaBasicaAnual = Math.round((cuantiaDiaria * 365) * 100) / 100;

  // Calcular Incremento Diario e Incremento Anual Total (redondeado a 2 decimales)
  const incrementoDiario = Math.round((salarioDiarioPromedio * incrementoAnual / 100) * 100) / 100;
  const incrementoAnualTotal = Math.round((incrementoDiario * 365 * this.getTotalAnosReconocidos(semanasCotizadas)) * 100) / 100;

  // Calcular Cuantía Anual de la Pensión Base (sin ayudas)
  const cuantiaAnualPensionBase = Math.round((cuantiaBasicaAnual + incrementoAnualTotal) * 100) / 100;

  // Calcular Ayudas
  const ayudaEsposa = esposa === 'si' ? Math.round((cuantiaAnualPensionBase * 0.15) * 100) / 100 : 0;
  const ayudaHijos = Math.round((hijosMenoresEstudiando * cuantiaAnualPensionBase * 0.10) * 100) / 100;
  const ayudaPadres = padres === 'si' ? Math.round((cuantiaAnualPensionBase * 0.20) * 100) / 100 : 0;

  // Calcular Cuantía Anual de la Pensión + Ayudas
  const cuantiaAnualPensionConAyudas = Math.round((cuantiaAnualPensionBase + ayudaEsposa + ayudaHijos + ayudaPadres) * 100) / 100;

  // Aplicar Incremento del 11% (Artículo Décimo) para obtener la Pensión Anual x Vejez
  const pensionAnualVejez = Math.round((cuantiaAnualPensionConAyudas * 1.11) * 100) / 100;
  const pensionMensualVejez = Math.round((pensionAnualVejez / 12) * 100) / 100;

  // Calcular Pensión por Cesantía en Edad Avanzada (aplicar porcentaje de edad sobre la Pensión Anual x Vejez)
  const porcentajeEdad = this.getPorcentajeEdad(edadJubilacion);
  console.log(`Porcentaje de Edad: ${porcentajeEdad}%`); // Depuración
  const pensionCesantia = Math.round((pensionAnualVejez * porcentajeEdad / 100) * 100) / 100;
  const pensionCesantiaMensual = Math.round((pensionCesantia / 12) * 100) / 100;

  return {
      pensionAnualVejez,
      pensionMensualVejez,
      pensionCesantia,
      pensionCesantiaMensual
  };
}

// Función para obtener el porcentaje de edad basado en la edad de jubilación
getPorcentajeEdad(edadJubilacion: number): number {
  if (edadJubilacion === 60) return 75;
  if (edadJubilacion === 61) return 80;
  if (edadJubilacion === 62) return 85;
  if (edadJubilacion === 63) return 90;
  if (edadJubilacion === 64) return 95;
  return 100;
}


// Función para buscar en la tabla
buscarEnTabla(vsm: number): { cuantiaBasica: number, incrementoAnual: number } {
  const tabla = [
      { desde: 0.00, hasta: 1.00, cuantiaBasica: 80.00, incrementoAnual: 0.56 },
      { desde: 1.01, hasta: 1.25, cuantiaBasica: 77.11, incrementoAnual: 0.81 },
      { desde: 1.26, hasta: 1.50, cuantiaBasica: 55.18, incrementoAnual: 1.18 },
      { desde: 1.51, hasta: 1.75, cuantiaBasica: 49.23, incrementoAnual: 1.43 },
      { desde: 1.76, hasta: 2.00, cuantiaBasica: 42.67, incrementoAnual: 1.62 },
      { desde: 2.01, hasta: 2.25, cuantiaBasica: 37.65, incrementoAnual: 1.76 },
      { desde: 2.26, hasta: 2.50, cuantiaBasica: 33.68, incrementoAnual: 1.87 },
      { desde: 2.51, hasta: 2.75, cuantiaBasica: 30.48, incrementoAnual: 1.96 },
      { desde: 2.76, hasta: 3.00, cuantiaBasica: 27.83, incrementoAnual: 2.03 },
      { desde: 3.01, hasta: 3.25, cuantiaBasica: 25.60, incrementoAnual: 2.10 },
      { desde: 3.26, hasta: 3.50, cuantiaBasica: 23.70, incrementoAnual: 2.15 },
      { desde: 3.51, hasta: 3.75, cuantiaBasica: 22.07, incrementoAnual: 2.20 },
      { desde: 3.76, hasta: 4.00, cuantiaBasica: 20.65, incrementoAnual: 2.24 },
      { desde: 4.01, hasta: 4.25, cuantiaBasica: 19.39, incrementoAnual: 2.27 },
      { desde: 4.26, hasta: 4.50, cuantiaBasica: 18.29, incrementoAnual: 2.30 },
      { desde: 4.51, hasta: 4.75, cuantiaBasica: 17.30, incrementoAnual: 2.33 },
      { desde: 4.76, hasta: 5.00, cuantiaBasica: 16.41, incrementoAnual: 2.36 },
      { desde: 5.01, hasta: 5.25, cuantiaBasica: 15.61, incrementoAnual: 2.38 },
      { desde: 5.26, hasta: 5.50, cuantiaBasica: 14.88, incrementoAnual: 2.40 },
      { desde: 5.51, hasta: 5.75, cuantiaBasica: 14.22, incrementoAnual: 2.42 },
      { desde: 5.76, hasta: 6.00, cuantiaBasica: 13.62, incrementoAnual: 2.43 },
      { desde: 6.01, hasta: Infinity, cuantiaBasica: 13.00, incrementoAnual: 2.45 }
  ];

  // Buscar el rango correspondiente al VSM
  const fila = tabla.find(fila => vsm >= fila.desde && vsm <= fila.hasta);

  if (fila) {
      return {
          cuantiaBasica: fila.cuantiaBasica,
          incrementoAnual: fila.incrementoAnual
      };
  } else {
      throw new Error('VSM fuera de rango');
  }
}


// Función para calcular la cuantía básica
getCuantiaBasica(vsm: number): number {
  if (vsm <= 1.00) return 80.00;
  if (vsm <= 1.25) return 77.11;
  if (vsm <= 1.50) return 55.18;
  if (vsm <= 1.75) return 49.23;
  if (vsm <= 2.00) return 42.67;
  if (vsm <= 2.25) return 37.65;
  if (vsm <= 2.50) return 33.68;
  if (vsm <= 2.75) return 30.48;
  if (vsm <= 3.00) return 27.83;
  if (vsm <= 3.25) return 25.60;
  if (vsm <= 3.50) return 23.70;
  if (vsm <= 3.75) return 22.07;
  if (vsm <= 4.00) return 20.65;
  if (vsm <= 4.25) return 19.39;
  if (vsm <= 4.50) return 18.29;
  if (vsm <= 4.75) return 17.30;
  if (vsm <= 5.00) return 16.41;
  if (vsm <= 5.25) return 15.61;
  if (vsm <= 5.50) return 14.88;
  if (vsm <= 5.75) return 14.22;
  if (vsm <= 6.00) return 13.62;
  return 13.00;
}

getIncrementoAnual(vsm: number): number {
  if (vsm <= 1.00) return 0.56;
  if (vsm <= 1.25) return 0.81;
  if (vsm <= 1.50) return 1.18;
  if (vsm <= 1.75) return 1.43;
  if (vsm <= 2.00) return 1.62;
  if (vsm <= 2.25) return 1.76;
  if (vsm <= 2.50) return 1.87;
  if (vsm <= 2.75) return 1.96;
  if (vsm <= 3.00) return 2.03;
  if (vsm <= 3.25) return 2.10;
  if (vsm <= 3.50) return 2.15;
  if (vsm <= 3.75) return 2.20;
  if (vsm <= 4.00) return 2.24;
  if (vsm <= 4.25) return 2.27;
  if (vsm <= 4.50) return 2.30;
  if (vsm <= 4.75) return 2.33;
  if (vsm <= 5.00) return 2.36;
  if (vsm <= 5.25) return 2.38;
  if (vsm <= 5.50) return 2.40;
  if (vsm <= 5.75) return 2.42;
  if (vsm <= 6.00) return 2.43;
  return 2.45;
}

getTotalAnosReconocidos(semanasCotizadas: number): number {
  const semanasReconocidas = semanasCotizadas - 500;
  return Math.floor(semanasReconocidas / 52);
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
