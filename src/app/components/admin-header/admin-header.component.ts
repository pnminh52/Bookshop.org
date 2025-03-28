import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../cart.service';
import { Product } from '../../type/Products';
import { WishlistService } from '../../wishlist.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  cartItemCount: number = 0;
    wishlistItemCount: number = 0;
    isLoggedIn: boolean = false;
    isSidebarVisible = false;
    alertMessage: string | null = null;
  
    constructor(
      private wishlistService: WishlistService,
      private authService: AuthService,
      private router: Router,
      private cartService: CartService
    ) {
      this.cartItemCount = this.cartService.getCartItemCount();
  
      this.wishlistService
        .getWishlistItemsObservable()
        .subscribe((wishlistItems: Product[]) => {
          this.wishlistItemCount = this.isLoggedIn ? wishlistItems.length : 0;
        });
  
      // // Theo dõi thay đổi trong giỏ hàng
      this.cartService
        .getCartItemsObservable()
        .subscribe((cartItems: Product[]) => {
          this.cartItemCount = cartItems.length;
        });
    }
    onItemClick(itemType: string): void {
      if (!this.isLoggedIn) {
        this.alertMessage = `You must be logged in to view your ${itemType}.`; // Hiển thị thông báo chung
        setTimeout(() => {
          this.alertMessage = null; 
        }, 3000);
      } else {
        if (itemType === 'cart') {
          this.router.navigate(['/cart']);
        } else if (itemType === 'wishlist') {
          this.router.navigate(['/wishlist']);
        }
      }
    }
  
    ngOnInit(): void {
      this.authService.isLoggedIn$.subscribe((status) => {
        this.isLoggedIn = status;
      });
    }
  
    logout(): void {
      this.authService.logout().subscribe(() => {});
    }
  
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    }
    closeSidebar() {
      this.isSidebarVisible = false;
    }
}
