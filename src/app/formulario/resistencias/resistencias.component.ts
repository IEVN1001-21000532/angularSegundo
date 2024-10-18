/*import { Component } from '@angular/core';
import { FormBuilder,FormGroup,  ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-resistencias',
  templateUrl: './resistencias.component.html',
  standalone: true,
  imports: [],
  styles: ``
})
export default class ResistenciasComponent {
  POR SI NO FUNCIONA
}
*/
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Resistencia {
  color1: string;
  color2: string;
  color3: string;
  tolerancia: string;
  valor?: string;     
  valorMax?: number; 
  valorMin?: number; 
}

@Component({
  selector: 'app-resistencias',
  templateUrl: './resistencias.component.html',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  standalone: true
})
export default class ResistenciasComponent {
  colores: string[] = ['Negro', 'Café', 'Rojo', 'Naranja', 'Amarillo', 'Verde', 'Azul', 'Morado', 'Gris', 'Blanco'];
  color1: string = '';
  color2: string = '';
  color3: string = '';
  tolerancia: string = '';
  resistencias: Resistencia[] = [];
  mostrarTabla: boolean = false; 

  registrar(): void {
   
    const resistenciaColores = {
      color1: this.color1,
      color2: this.color2,
      color3: this.color3,
      tolerancia: this.tolerancia
    };

    this.resistencias.push(resistenciaColores);
    localStorage.setItem('resistencias', JSON.stringify(this.resistencias)); //convertir JSON!! IMPORTANTE
    this.mostrarTabla = false;
  }

  imprimir(): void {
    // aqui se tiene que recuperar lso datps y despues imprimir. 
    const storedResistencias = localStorage.getItem('resistencias');
    if (storedResistencias) {
      this.resistencias = JSON.parse(storedResistencias);
      this.resistencias = this.resistencias.map(res => {
        const color1Value = this.convertirColor(res.color1);
        const color2Value = this.convertirColor(res.color2);
        const color3Value = this.convertirColor(res.color3);
        const toleranciaValue = this.toleranciaValor(res.tolerancia);

        const valor = `${color1Value}${color2Value}${color3Value}`;
        const valorNumerico = parseInt(valor, 10);
        const valorMax = valorNumerico + (valorNumerico * toleranciaValue);
        const valorMin = valorNumerico - (valorNumerico * toleranciaValue);

        return {
          ...res,  // al tener las propiedades asi, res las toma para poder tomar el array
          valor,
          valorMax,
          valorMin,
        };
      });
    }


    this.mostrarTabla = true;
  }

  convertirColor(color: string): number {
    switch (color) {
      case 'Negro': return 0;
      case 'Café': return 1;
      case 'Rojo': return 2;
      case 'Naranja': return 3;
      case 'Amarillo': return 4;
      case 'Verde': return 5;
      case 'Azul': return 6;
      case 'Morado': return 7;
      case 'Gris': return 8;
      case 'Blanco': return 9;
      default: return 0;
    }
  }

  obtenerColorHex(color: string): string {
    switch (color) {
      case 'Negro': return '#000000';
      case 'Café': return '#8B4513';
      case 'Rojo': return '#FF0000';
      case 'Naranja': return '#FFA500';
      case 'Amarillo': return '#FFFF00';
      case 'Verde': return '#008000';
      case 'Azul': return '#0000FF';
      case 'Morado': return '#800080';
      case 'Gris': return '#808080';
      case 'Blanco': return '#FFFFFF';
      default: return '#FFFFFF'; 
    }
  }

  toleranciaValor(tolerancia: string): number {
    return tolerancia === 'Oro' ? 0.05 : 0.1;
  }
}

