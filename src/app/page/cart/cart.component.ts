import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart.service'; // Import CartService
import { Product } from '../../type/Products';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cartItems: Product[] = [];

  constructor(private cartService: CartService) {
    this.cartItems = this.cartService.getCartItems(); // Lấy danh sách sản phẩm từ service
  }

  removeFromCart(product: Product): void {
    this.cartService.removeFromCart(product); // Gọi service để xóa sản phẩm
    this.cartItems = this.cartService.getCartItems(); // Cập nhật danh sách sản phẩm
  }

  getTotal(): number {
    return this.cartService.getTotal(); // Lấy tổng giá trị từ service
  }
}