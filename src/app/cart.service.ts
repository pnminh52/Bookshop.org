import { Injectable } from '@angular/core';
import { Product } from '../app/type/Products';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: Product[] = [];
  private cartItemsSubject = new BehaviorSubject<Product[]>([]);
  private userKey: string | null = null;

  constructor() {

    const savedUserKey = localStorage.getItem('userKey');
    if (savedUserKey) {
      this.userKey = savedUserKey;
      this.loadCartForUser(savedUserKey);
    }
  }


  getCartItems(): Product[] {
    return this.cartItems;
  }


  addToCart(product: Product): void {
    const existingProduct = this.cartItems.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1; 
      this.cartItems.push(product);
    }
    this.cartItemsSubject.next(this.cartItems);
    this.saveCart(); 
  }


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
    if (this.userKey) {
      localStorage.setItem(`cart_${this.userKey}`, JSON.stringify(this.cartItems)); 
    }
  }
  

  loadCartForUser(userId: string): void {
    if (userId) {
      const savedCart = localStorage.getItem(`cart_${userId}`); 
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
        this.cartItemsSubject.next(this.cartItems);
      }
    } else {
      console.error('User ID is required to load the cart');
    }
  }
  

  loadCartOnLogin(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id) {
      this.userKey = user.id;
      if (this.userKey) {
        localStorage.setItem('userKey', this.userKey); 
        this.loadCartForUser(this.userKey); 
      } else {
        console.error('User ID is missing!');
      }
    }
  }
  



  clearCart(): void {
    this.cartItems = []; 
    this.cartItemsSubject.next(this.cartItems); 
    if (this.userKey) {
      localStorage.removeItem(`cart_${this.userKey}`);
    }
  }
  

}
