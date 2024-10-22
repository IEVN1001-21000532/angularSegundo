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
  mostrarTabla = false;  //igual que en resistencias, oculta la tabla

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
    if (horasTrabajadas <= 40) {
      return horasTrabajadas * tarifaNormal;
    } else {
      const horasExtras = horasTrabajadas - 40;
      return (40 * tarifaNormal) + (horasExtras * tarifaExtra);
    }
  }

  registrar(): void {
    const nuevoEmpleado = { ...this.empleadoForm.value, sueldo: this.calcularSueldo(this.empleadoForm.value.horasTrabajadas) };
    this.empleados.push(nuevoEmpleado);
    localStorage.setItem('empleados', JSON.stringify(this.empleados));
    this.empleadoForm.reset();
    this.mostrarTabla = false; 
  }

  imprimir(): void {
    const storedEmpleados = localStorage.getItem('empleados');
    if (storedEmpleados) {
      this.empleados = JSON.parse(storedEmpleados);
    }
    this.mostrarTabla = true; 
  }

  modificar(): void {
    const matricula = this.empleadoForm.value.matricula;
    const index = this.empleados.findIndex(emp => emp.matricula === matricula);
    if (index !== -1) {
      this.empleados[index] = { ...this.empleadoForm.value, sueldo: this.calcularSueldo(this.empleadoForm.value.horasTrabajadas) };
      localStorage.setItem('empleados', JSON.stringify(this.empleados));
    }
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
}
