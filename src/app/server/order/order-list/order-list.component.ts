import { Component } from '@angular/core';
import { OrderService } from 'src/app/order.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'], 
})
export class OrderListComponent {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe((orders) => {
      this.orders = orders.reverse();
    });
  }
}
