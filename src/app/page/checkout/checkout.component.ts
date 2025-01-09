// checkout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart.service';
import { Product } from '../../type/Products';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  cartItems: Product[] = [];
  total: number = 0;
  user: any = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotal();
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  // Hàm thanh toán
  checkout(): void {
    const order = {
      userId: this.user.id,
      items: this.cartItems,
      total: this.total,
      date: new Date().toISOString(),
      status: 'completed',
    };

    // Gửi yêu cầu thêm đơn hàng
    this.orderService.addOrder(order).subscribe({
      next: (response) => {
        // Cập nhật orderHistory của người dùng
        this.orderService.updateUserOrderHistory(this.user.id, order).subscribe({
          next: (userResponse) => {
            alert('Thanh toán thành công!');
            this.router.navigate(['/']);
            this.cartService.clearCart();
          },
          error: (userError) => {
            console.error('Lỗi khi cập nhật orderHistory:', userError);
            alert('Có lỗi xảy ra khi cập nhật lịch sử đơn hàng.');
          },
        });
      },
      error: (error) => {
        console.error('Lỗi khi thêm đơn hàng:', error);
        alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
      },
    });
  }
}