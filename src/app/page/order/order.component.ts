import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../order.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

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

  constructor(private orderService: OrderService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.user && this.user.id) {
      this.orderService.getUserOrders(this.user.id).subscribe({
        next: (orders) => {
          this.orders = orders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        },
        error: (error) => {
          console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        }
      });
    }
  }

  cancelOrder(orderId: string) {
    this.orderService.updateOrderStatus(orderId, 'Cancelled').subscribe({
      next: () => {
        // Cập nhật lại danh sách đơn hàng sau khi hủy
        this.orders = this.orders.map(order => 
          order.id === orderId ? { ...order, status: 'Cancelled' } : order
        );
        this.snackBar.open('Đơn hàng đã được hủy thành công!', 'Đóng', {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 3000,
          panelClass: ['success-snackbar'] // Áp dụng class tùy chỉnh
        });
      },
      error: (error) => {
        console.error('Lỗi khi hủy đơn hàng:', error);
        this.snackBar.open('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.', 'Đóng', { duration: 3000 });
      }
    });
  }
}
