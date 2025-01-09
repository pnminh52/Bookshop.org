// order.component.ts
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order',
  imports:[CommonModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  user: any = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.user && this.user.id) {
      this.orderService.getUserOrders(this.user.id).subscribe({
        next: (orders) => {
          this.orders = orders;
        },
        error: (error) => {
          console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        }
      });
    }
  }
}