import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface PizzaRequest {
  id?: number;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  orderDate: string;
  orderDetails: {
    pizzaSize: string;
    toppings: string[];
    amount: number;
  };
  totalCost: number;
}

interface CustomerOrder {
  orderDate: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  pizzaOrders: PizzaRequest[];
  totalAmount: number;
}

@Component({
  selector: 'app-tabla-pedidos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tabla-pedidos.component.html',
  styleUrls: ['./tabla-pedidos.component.css']
})
export default class TablaComponent implements OnInit {
  @ViewChild('dailySalesDate') dailySalesDate!: ElementRef;
  orderForm!: FormGroup;
  pizzaOrders: PizzaRequest[] = [];
  toppingsAvailable = ['Jamon', 'Piña', 'Peperoni','Salchicha'];
  pizzaSizes = ['Chica', 'Mediana', 'Grande'];
  overallTotal: number = 0;
  dailySalesData: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.loadOrdersFromStorage();
  }

  private initializeForm() {
    const today = new Date().toISOString().split('T')[0];
    this.orderForm = this.fb.group({
      clientName: ['', Validators.required],
      clientAddress: ['', Validators.required],
      clientPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      orderDate: [{ value: today, disabled: false }, Validators.required],
      pizzaSize: ['', Validators.required],
      toppings: this.fb.group({
        Jamon: [false],
        Piña: [false],
        Peperoni: [false],
        Salchicha:[false]
      }),
      amount: [1, [Validators.required, Validators.min(1)]]
    });
  }

  private calculateCost(size: string, toppings: string[], amount: number): number {
    let baseCost = 0;
    switch (size) {
      case 'Chica':
        baseCost = 65;
        break;
      case 'Mediana':
        baseCost = 90;
        break;
      case 'Grande':
        baseCost = 150;
        break;
    }
    baseCost += toppings.length * 10;
    return baseCost * amount;
  }

  onAddOrder() {
    if (this.orderForm.valid) {
      const chosenToppings = Object.entries(this.orderForm.value.toppings)
        .filter(([_, isSelected]) => isSelected)
        .map(([topping]) => topping);

      const newOrder: PizzaRequest = {
        clientName: this.orderForm.value.clientName,
        clientAddress: this.orderForm.value.clientAddress,
        clientPhone: this.orderForm.value.clientPhone,
        orderDate: this.orderForm.get('orderDate')?.value,
        orderDetails: {
          pizzaSize: this.orderForm.value.pizzaSize,
          toppings: chosenToppings,
          amount: this.orderForm.value.amount
        },
        totalCost: this.calculateCost(this.orderForm.value.pizzaSize, chosenToppings, this.orderForm.value.amount)
      };

      this.pizzaOrders.push(newOrder);
      this.overallTotal += newOrder.totalCost;
      this.saveOrdersToStorage();

      this.orderForm.patchValue({
        pizzaSize: '',
        toppings: { Jamon: false, Piña: false, Peperoni: false, Salchica:false },
        amount: 1
      });
    }
  }

  removeOrder(index: number) {
    this.overallTotal -= this.pizzaOrders[index].totalCost;
    this.pizzaOrders.splice(index, 1);
    this.saveOrdersToStorage();
  }

  completeOrder() {
    if (this.pizzaOrders.length > 0) {
      const finalOrder: CustomerOrder = {
        orderDate: this.orderForm.get('orderDate')?.value,
        clientName: this.orderForm.value.clientName,
        clientAddress: this.orderForm.value.clientAddress,
        clientPhone: this.orderForm.value.clientPhone,
        pizzaOrders: this.pizzaOrders,
        totalAmount: this.overallTotal
      };

      const savedOrders = JSON.parse(localStorage.getItem('completedOrders') || '[]');
      savedOrders.push(finalOrder);
      localStorage.setItem('completedOrders', JSON.stringify(savedOrders));

      alert('Order saved successfully.');
      this.pizzaOrders = [];
      this.overallTotal = 0;
      this.orderForm.reset();
      this.initializeForm();
      this.saveOrdersToStorage();
    } else {
      alert('No orders to complete.');
    }
  }

  fetchDailySales() {
    const selectedDate = this.dailySalesDate.nativeElement.value;
    const savedOrders = JSON.parse(localStorage.getItem('completedOrders') || '[]');
    this.dailySalesData = savedOrders.filter((order: any) => order.orderDate === selectedDate);
  }

  private saveOrdersToStorage() {
    localStorage.setItem('pizzaOrders', JSON.stringify(this.pizzaOrders));
  }

  private loadOrdersFromStorage() {
    const savedOrders = JSON.parse(localStorage.getItem('pizzaOrders') || '[]');
    this.pizzaOrders = savedOrders;
    this.overallTotal = this.pizzaOrders.reduce((total, order) => total + order.totalCost, 0);
  }
}
