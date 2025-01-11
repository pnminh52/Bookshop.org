import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../order.service';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../components/popup/popup.component'; // Import PopupComponent
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
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

  constructor(
    private orderService: OrderService, 
    private dialog: MatDialog // Inject MatDialog
  ) {}

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
    this.dialog.open(PopupComponent, { // Mở Popup khi bấm hủy đơn hàng
      data: {
        message: 'Bạn có chắc chắn muốn hủy đơn hàng này?'
      }
    }).afterClosed().subscribe(result => {
      if (result === 'confirm') {
        // Nếu người dùng xác nhận, hủy đơn hàng
        this.orderService.updateOrderStatus(orderId, 'Cancelled').subscribe({
          next: () => {
            this.orders = this.orders.map(order =>
              order.id === orderId ? { ...order, status: 'Cancelled' } : order
            );
            alert('Đơn hàng đã được hủy thành công!');
          },
          error: (error) => {
            // console.error('Lỗi khi hủy đơn hàng:', error);
            alert('Có lỗi xảy ra khi hủy đơn hàng.');
          }
        });
      }
    });
  }
}
