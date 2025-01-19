import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { CartService } from '../../cart.service';
import { Product } from '../../type/Products';
import { WishlistService } from '../../wishlist.service';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.css'
})
export class UserHeaderComponent {
  cartItemCount: number = 0;
  wishlistItemCount: number = 0;
  isLoggedIn: boolean = false;
  successMessage: string | null = null;
  isSidebarVisible = false;
  alertMessage: string | null = null;
  slideshowText: string[] = [
    'Every purchase supports our local bookstores!',
    'Explore more books with amazing discounts!',
    'Join our book club for exclusive offers!'
  ];
  currentIndex: number = 0;

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
        this.wishlistItemCount = wishlistItems.length
            });

    // // Theo dõi thay đổi trong giỏ hàng
    this.cartService
      .getCartItemsObservable()
      .subscribe((cartItems: Product[]) => {
        this.cartItemCount = cartItems.length;
      });
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        window.scrollTo(0, 0);
      });
  }
  onItemClick(itemType: string): void {
    if (!this.isLoggedIn) {
      this.alertMessage = `You must be logged in to view your ${itemType}.`; 
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
      if (this.isLoggedIn) {
        this.loadWishlist();
      } else {
        this.wishlistItemCount = 0; 
      }
    });

    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slideshowText.length;
    }, 3000);
  }
  loadWishlist(): void {
    if (this.isLoggedIn) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.wishlistService.getWishlist(userId).subscribe((wishlist: Product[]) => {
          this.wishlistItemCount = wishlist.length; 
        });
      }
    }
  }
  logout(): void {
    this.authService.logout().subscribe(() => {
      this.wishlistItemCount = 0;
    });
    this.successMessage = 'Logout successfully!';
    setTimeout(() => {
      this.successMessage = null; 
    }, 3000);
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  closeSidebar() {
    this.isSidebarVisible = false;
  }
}
