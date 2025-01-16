import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart.service'; 
import { Product } from '../../type/Products';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cartItems: Product[] = [];
 

  constructor(private cartService: CartService, private router: Router) {
    this.cartItems = this.cartService.getCartItems(); 
  }

  
  removeFromCart(product: Product): void {
    this.cartService.removeFromCart(product);
    this.cartItems = this.cartService.getCartItems();
  }

  increaseQuantity(product: Product): void {
    this.cartService.increaseQuantity(product);
    this.cartItems = this.cartService.getCartItems();
  }

  decreaseQuantity(product: Product): void {
    this.cartService.decreaseQuantity(product);
    this.cartItems = this.cartService.getCartItems();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }
  proceedToCheckout(): void {
    this.router.navigate(['/checkout']); 
  }
}