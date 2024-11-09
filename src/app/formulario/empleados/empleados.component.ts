import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Empleado {
  matricula: string;
  nombre: string;
  correo: string;
  edad: number;
  horasTrabajadas: number;
  sueldo: number;
  horasExtras: number;
  sueldoPorHoras: number;
  sueldoPorExtras: number;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './empleados.component.html',
  styles: []
})
export default class EmpleadosComponent {
  empleadoForm: FormGroup;
  empleados: Empleado[] = [];
  mostrarTabla = false;

  constructor(private fb: FormBuilder) {
    this.empleadoForm = this.fb.group({
      matricula: ['', Validators.required],
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      edad: ['', Validators.required],
      horasTrabajadas: ['', Validators.required]
    });
    this.cargarEmpleados();
  }

  calcularSueldo(horasTrabajadas: number): number {
    const tarifaNormal = 70;
    const tarifaExtra = 140;
    const horasPorPagar = horasTrabajadas <= 40 ? horasTrabajadas : 40;
    const horasExtras = horasTrabajadas > 40 ? horasTrabajadas - 40 : 0;
    return (horasPorPagar * tarifaNormal) + (horasExtras * tarifaExtra);
  }

  calcularSueldoPorHoras(horas: number): number {
    return horas * 70;
  }

  calcularSueldoPorExtras(horasExtras: number): number {
    return horasExtras * 140;
  }

  registrar(): void {
    const horasTrabajadas = this.empleadoForm.value.horasTrabajadas;
    const horasExtras = horasTrabajadas > 40 ? horasTrabajadas - 40 : 0;

    // aquí tengo que agregar la función matrícula
    const matricula = this.empleadoForm.value.matricula;
    const index = this.empleados.findIndex(emp => emp.matricula === matricula);

    if (index !== -1) {
      this.empleados[index] = { 
        ...this.empleadoForm.value, 
        sueldo: this.calcularSueldo(horasTrabajadas),
        horasExtras: horasExtras,
        sueldoPorHoras: this.calcularSueldoPorHoras(horasTrabajadas <= 40 ? horasTrabajadas : 40),
        sueldoPorExtras: this.calcularSueldoPorExtras(horasExtras)
      };
    } else {
      const nuevoEmpleado = { 
        ...this.empleadoForm.value, 
        sueldo: this.calcularSueldo(horasTrabajadas),
        horasExtras: horasExtras,
        sueldoPorHoras: this.calcularSueldoPorHoras(horasTrabajadas <= 40 ? horasTrabajadas : 40),
        sueldoPorExtras: this.calcularSueldoPorExtras(horasExtras)
      };
      this.empleados.push(nuevoEmpleado);
    }

    localStorage.setItem('empleados', JSON.stringify(this.empleados));
    this.empleadoForm.reset();
    // Asegúrate de que la tabla no se muestre después de registrar
    this.mostrarTabla = false; 
  }

  modificar(): void {
    const matricula = this.empleadoForm.value.matricula;
    const empleado = this.empleados.find(emp => emp.matricula === matricula);

    if (empleado) {
      this.empleadoForm.patchValue({
        matricula: empleado.matricula,
        nombre: empleado.nombre,
        correo: empleado.correo,
        edad: empleado.edad,
        horasTrabajadas: empleado.horasTrabajadas
      });
    }
  }

  imprimir(): void {
    const storedEmpleados = localStorage.getItem('empleados');
    if (storedEmpleados) {
      this.empleados = JSON.parse(storedEmpleados);
    }
    // Muestra la tabla solo al imprimir
    this.mostrarTabla = true; 
  }

  eliminar(matricula: string): void {
    this.empleados = this.empleados.filter(emp => emp.matricula !== matricula);
    localStorage.setItem('empleados', JSON.stringify(this.empleados));
  }

  cargarEmpleados(): void {
    const storedEmpleados = localStorage.getItem('empleados');
    if (storedEmpleados) {
      this.empleados = JSON.parse(storedEmpleados);
    }
  }

  // Método para calcular el total de sueldos
  calcularTotalSueldos(): number {
    return this.empleados.reduce((total, emp) => total + emp.sueldo, 0);
  }
}
