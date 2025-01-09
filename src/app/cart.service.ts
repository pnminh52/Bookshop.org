import { Injectable } from '@angular/core';
import { Product } from '../app/type/Products';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Service sẽ được cung cấp ở root level
})
export class CartService {
  private cartItems: Product[] = [];
  private cartItemsSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    // Load cart items from localStorage khi service khởi tạo
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  // Lấy danh sách sản phẩm trong giỏ hàng
  getCartItems(): Product[] {
    return this.cartItems;
  }

  addToCart(product: Product): void {
    const existingProduct = this.cartItems.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = product.quantity || 1; // Mặc định quantity là 1 nếu không được truyền vào
      this.cartItems.push(product);
    }
    this.cartItemsSubject.next(this.cartItems);
    this.saveCart();
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(product: Product): void {
    const existingProduct = this.cartItems.find((item) => item.id === product.id);
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
      } else {
        this.cartItems = this.cartItems.filter((item) => item.id !== product.id);
      }
    }
    this.cartItemsSubject.next(this.cartItems);
    this.saveCart();
  }

  // Tính tổng giá trị giỏ hàng
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price_after_discount * item.quantity, 0);
  }

  getCartItemCount(): number {
    return this.cartItems.length;
  }
  getCartItemsObservable(): Observable<Product[]> {
    return this.cartItemsSubject.asObservable();
  }

  increaseQuantity(product: Product): void {
    const existingProduct = this.cartItems.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    }
    this.cartItemsSubject.next(this.cartItems);
    this.saveCart();
  }

  decreaseQuantity(product: Product): void {
    const existingProduct = this.cartItems.find((item) => item.id === product.id);
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
      } else {
        this.cartItems = this.cartItems.filter((item) => item.id !== product.id);
      }
    }
    this.cartItemsSubject.next(this.cartItems);
    this.saveCart();
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}