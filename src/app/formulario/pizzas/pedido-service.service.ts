import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Pizza {
  tamano: string;
  ingredientes2: string[];
  cantidad: number;
  subtotal: number;
}

interface Pedido {
  nombreCliente: string;
  direccion: string;
  telefono: string;
  fechaCompra: string;
  pizzas: Pizza[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private pedidos: Pedido[] = [];
  private pizzas: Pizza[] = [];
  
  private clienteInfo = {
    nombreCliente: '',
    direccion: '',
    telefono: '',
    fechaCompra: ''
  };

  
  private pizzasSubject = new BehaviorSubject<Pizza[]>([]);
  pizzas$ = this.pizzasSubject.asObservable();

  constructor() {
    this.inicializarPedidos();
  }
  private inicializarPedidos() {
    const pedidosGuardados = localStorage.getItem('pedidos');
  
  if (pedidosGuardados && pedidosGuardados !== '[]') {
    this.pedidos = JSON.parse(pedidosGuardados);
  } else {
    this.pedidos = []; 
  }
  }

  setDatosCliente(nombre: string, direccion: string, telefono: string, fecha: string) {
    this.clienteInfo = { nombreCliente: nombre, direccion: direccion, telefono: telefono, fechaCompra: fecha };
  }

  getDatosCliente() {
    return this.clienteInfo;
  }

  agregarPizza(pizza: Pizza) {
    this.pizzas.push(pizza);
    this.pizzasSubject.next(this.pizzas);
  }

  obtenerPizzas(): Pizza[] {
    return this.pizzas;
  }

  eliminarPizza(pizza: Pizza) {
    this.pizzas = this.pizzas.filter(p => p !== pizza);
    this.pizzasSubject.next(this.pizzas);
  }

  finalizarPedido() {
    const total = this.pizzas.reduce((acc, pizza) => acc + pizza.subtotal, 0);
    const pedido: Pedido = {
      ...this.clienteInfo,
      pizzas: this.pizzas,
      total: total
    };
    this.pedidos.push(pedido);
    this.guardarPedidos(); 
    this.pizzas = []; 
    this.pizzasSubject.next(this.pizzas);
  }

  obtenerPedidosPorFecha(fecha: string): Pedido[] {
    return this.pedidos.filter(pedido => pedido.fechaCompra === fecha);
  }

  obtenerVentasPorMes(mes: string): Pedido[] {
    return this.pedidos.filter(pedido => pedido.fechaCompra && pedido.fechaCompra.startsWith(mes));
  }

  obtenerVentasTotales(): number {
    return this.pedidos.reduce((total, pedido) => total + pedido.total, 0);
  }

  private guardarPedidos() {
    localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
  }
}