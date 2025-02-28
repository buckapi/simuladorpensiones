import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home2.component.html',
  styleUrl: './home2.component.css'
})
export class Home2Component {
  pensionForm: FormGroup;
  pensionVejez: number = 0;
  pensionCesantia: number = 0;

  // Rango de edad de jubilación de 60 a 65 años
  edadesJubilacion: number[] = [60, 61, 62, 63, 64, 65];

  constructor(private fb: FormBuilder) {
    this.pensionForm = this.fb.group({
      semanasCotizadas: [1500, [Validators.required, Validators.min(1)]],
      salarioDiarioPromedio: [1500, [Validators.required, Validators.min(1)]],
      esposa: [false, [Validators.required]],
      hijos: [1, [Validators.required, Validators.min(0)]],
      padres: [false, [Validators.required]],
      edadJubilacion: [60, [Validators.required]]  // Edad de jubilación por defecto es 60
    });
  }

  // Función para calcular las pensiones
  
  // Función para calcular las pensiones
  calcularPensiones() {
    const formValue = this.pensionForm.value;
    
    const semanasCotizadas = formValue.semanasCotizadas;
    const salarioDiarioPromedio = formValue.salarioDiarioPromedio;
    const esposa = formValue.esposa;
    const hijos = formValue.hijos;
    const edadJubilacion = formValue.edadJubilacion;

    // Pensión de vejez (aproximada)
    this.pensionVejez = this.calcularPensionVejez(semanasCotizadas, salarioDiarioPromedio, esposa, hijos);
    
    // Pensión por cesantía en edad avanzada (aproximada)
    this.pensionCesantia = this.calcularPensionCesantia(semanasCotizadas, salarioDiarioPromedio, esposa, hijos, edadJubilacion);
  }

  // Cálculo de la pensión de vejez
  calcularPensionVejez(semanas: number, salario: number, esposa: boolean, hijos: number): number {
    const salarioPromedio = salario;
    let porcentajePension = 0.80; // Aproximadamente 80% del salario promedio

    // Ajuste por esposa e hijos (esto puede variar dependiendo de las políticas exactas)
    if (esposa) {
      porcentajePension += 0.05; // Añadir un 5% por esposa (ajuste aproximado)
    }

    // Añadir ajuste por hijos (aproximadamente 3% por cada hijo)
    porcentajePension += hijos * 0.03;

    // Calcular la pensión final
    let pensionBase = salarioPromedio * porcentajePension;
    return pensionBase; // Retorna el valor calculado
  }

  // Cálculo de la pensión por cesantía
  calcularPensionCesantia(semanas: number, salario: number, esposa: boolean, hijos: number, edadJubilacion: number): number {
    let salarioPromedio = salario;
    let porcentajePension = 0.70; // Aproximadamente 70% del salario promedio para cesantía

    // Ajuste por esposa e hijos (esto puede variar dependiendo de las políticas exactas)
    if (esposa) {
      porcentajePension += 0.05; // Añadir un 5% por esposa
    }

    porcentajePension += hijos * 0.02; // Añadir ajuste por hijos

    // Calcular la pensión final
    let pensionBase = salarioPromedio * porcentajePension;
    return pensionBase; // Retorna el valor calculado
  }
}
