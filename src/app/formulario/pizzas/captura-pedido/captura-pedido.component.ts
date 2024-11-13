import { Component } from '@angular/core';
import { PedidoService } from '../pedido-service.service';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-captura-pedido',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './captura-pedido.component.html',
  styles: ``
})
export class CapturaPedidoComponent {

  pedidoForm: FormGroup;

  constructor(private fb: FormBuilder, private pedidoService: PedidoService) {
    this.pedidoForm = this.fb.group({
      nombreCliente: [''],
      direccion: [''],
      telefono: [''],
      fechaCompra: [''],
      tamanoPizza: [''],
      jamon: [false],
      pina: [false],
      champinones: [false],
      cantidadPizzas: [1]
    });
  }

  agregarPizza() {
    const { nombreCliente, direccion, telefono, fechaCompra, tamanoPizza, jamon, pina, champinones, cantidadPizzas } = this.pedidoForm.value;

    const ingredientesSeleccionados = ['jamon', 'pina', 'champinones']
      .filter(ing => this.pedidoForm.get(ing)?.value)
      .map(ing => ing.charAt(0).toUpperCase() + ing.slice(1));

    const subtotal = this.calcularSubtotal(tamanoPizza, ingredientesSeleccionados.length, cantidadPizzas);
    const pizza = {
      tamano: tamanoPizza,
      ingredientes2: ingredientesSeleccionados,
      cantidad: cantidadPizzas,
      subtotal: subtotal
    };

    this.pedidoService.agregarPizza(pizza);
    this.pedidoService.setDatosCliente(nombreCliente, direccion, telefono, fechaCompra);

    this.pedidoForm.reset({
      nombreCliente: nombreCliente,
      direccion: direccion,
      telefono: telefono,
      fechaCompra: fechaCompra,
      cantidadPizzas: 1, 
      tamanoPizza: '',
      jamon: false,
      pina: false,
      champinones: false
    });
  }

  calcularSubtotal(size: string, ingredientsCount: number, quantity: number): number {
    const precioBase = size === 'Chica' ? 40 : size === 'Mediana' ? 80 : 120;
    const ingredientesPrecio = ingredientsCount * 10;
    return (precioBase + ingredientesPrecio) * quantity;
  }
}
