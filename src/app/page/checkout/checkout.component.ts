import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart.service'; // Import CartService
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
  user: any = null; // Thông tin người dùng

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router:Router
  ) {
    this.cartItems = this.cartService.getCartItems(); // Lấy danh sách sản phẩm từ service
    this.total = this.cartService.getTotal(); // Lấy tổng tiền
    // Lấy thông tin người dùng từ localStorage hoặc service
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  // Hàm thanh toán
  checkout(): void {
    const order = {
      userId: this.user.id, // ID người dùng
      items: this.cartItems, // Danh sách sản phẩm
      total: this.total, // Tổng tiền
      date: new Date().toISOString(), // Ngày đặt hàng
      status: 'completed', // Trạng thái đơn hàng
    };

    // Gửi yêu cầu thêm đơn hàng
    this.orderService.addOrder(order).subscribe({
      next: (response) => {
        alert('Thanh toán thành công!');
        this.router.navigate(['/']);
        this.cartService.clearCart(); // Xóa giỏ hàng sau khi thanh toán
      },
      error: (error) => {
        console.error('Lỗi khi thêm đơn hàng:', error);
        alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
      },
    });
  }
}