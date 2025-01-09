import { Injectable } from '@angular/core';
import { Product } from '../app/type/Products';

@Injectable({
  providedIn: 'root', // Service sẽ được cung cấp ở root level
})
export class CartService {
  private cartItems: Product[] = [];

  constructor() {
    // Load cart items from localStorage khi service khởi tạo
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }
  }

  // Lấy danh sách sản phẩm trong giỏ hàng
  getCartItems(): Product[] {
    return this.cartItems;
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(product: Product): void {
    this.cartItems.push(product);
    this.saveCart();
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(product: Product): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== product.id);
    this.saveCart();
  }

  // Tính tổng giá trị giỏ hàng
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price_after_discount, 0);
  }

  // Lưu giỏ hàng vào localStorage
  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}