import { Component } from '@angular/core';
import { PedidoService } from '../pedido-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-ventas-dia',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './ventas-dia.component.html',
  styles: ``
})
export class VentasDiaComponent {
  pedidosDia: any[] = [];
  ventasTotalesDia: number = 0;
  fechaSeleccionada: string = '';
  mesSeleccionado: string = '';

  constructor(private pedidoService: PedidoService) {}

  mostrarVentasPorDia() {
    this.pedidosDia = this.pedidoService.obtenerPedidosPorFecha(this.fechaSeleccionada);
    this.ventasTotalesDia = this.pedidosDia.reduce((total, pedido) => total + pedido.total, 0);
  }

  mostrarVentasPorMes() {
    this.pedidosDia = this.pedidoService.obtenerVentasPorMes(this.mesSeleccionado);
    this.ventasTotalesDia = this.pedidosDia.reduce((total, pedido) => total + pedido.total, 0);
  }
}
