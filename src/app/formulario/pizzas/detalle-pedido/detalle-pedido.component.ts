import { Component } from '@angular/core';
import { PedidoService } from '../pedido-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './detalle-pedido.component.html',
  styles: ``
})
export class DetallePedidoComponent {

  pizzas: any[] = [];
  totalPedido = 0;

  constructor(public pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.pedidoService.pizzas$.subscribe(pizzas => {
      this.pizzas = pizzas;
      this.calcularTotalPedido();
    });
  }

  quitarUltimoPedido() {
    if (this.pizzas.length > 0) {
      const ultimaPizza = this.pizzas[this.pizzas.length - 1];
      this.pedidoService.eliminarPizza(ultimaPizza);
    }
  }

  finalizarPedido() {
    if (window.confirm(`El total del pedido es $${this.totalPedido}. ¿Deseas confirmar el pedido?`)) {
      this.pedidoService.finalizarPedido();
      alert('Pedido guardado con éxito');
    } else {
      alert('Puedes editar tu pedido');
    }
  }

  private calcularTotalPedido() {
    this.totalPedido = this.pizzas.reduce((total, pizza) => total + pizza.subtotal, 0);
  }
  
}
