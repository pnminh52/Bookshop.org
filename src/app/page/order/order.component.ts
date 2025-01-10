import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../order.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-order',
  imports: [CommonModule],
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
          // Sắp xếp đơn hàng theo ngày, đơn hàng mới nhất lên đầu
          this.orders = orders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        },
        error: (error) => {
          console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        }
      });
    }
  }
}
