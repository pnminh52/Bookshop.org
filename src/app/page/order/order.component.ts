import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../order.service';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../components/popup/popup.component'; 
import { MatDialog } from '@angular/material/dialog'; 
import { CancelorderReasonComponent } from 'src/app/components/cancelorder-reason/cancelorder-reason.component';
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
  hasCancelledOrders: boolean = false;

  constructor(
    private orderService: OrderService, 
    private dialog: MatDialog 
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.user && this.user.id) {
      this.orderService.getUserOrders(this.user.id).subscribe({
        next: (orders) => {
          this.orders = orders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
          this.hasCancelledOrders = this.orders.some(order => order.status === 'Cancelled'); // Cập nhật biến
        },
        error: (error) => {
          console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        }
      });
    }
  }

  cancelOrder(orderId: string) {
    this.dialog.open(CancelorderReasonComponent).afterClosed().subscribe(reason => {
      if (reason) {
        this.orderService.updateOrderStatus(orderId, 'Cancelled', reason).subscribe(() => {
          this.orders = this.orders.map(order =>
            order.id === orderId ? { ...order, status: 'Cancelled' } : order
          );
          alert('Đơn hàng đã được hủy thành công với lý do: ' + reason);
        });
      }
    });
  }
}
