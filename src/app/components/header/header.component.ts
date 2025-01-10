import { Component, OnInit, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../cart.service';
import { Product } from '../../type/Products';
import { WishListService } from '../../wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,  // Đảm bảo component này là standalone
  imports: [CommonModule],  // Thêm CommonModule vào imports
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartItemCount: number =0;
  wishlistItemCount: number = 0;
  isLoggedIn: boolean = false;
  isSidebarVisible = false;

  constructor(private authService: AuthService, private router: Router, private cartService: CartService,  private wishlistService: WishListService) {

    this.cartItemCount = this.cartService.getCartItemCount();

    // Theo dõi thay đổi trong giỏ hàng
    this.cartService.getCartItemsObservable().subscribe((cartItems: Product[]) => {
      this.cartItemCount = cartItems.length;
    });
    
    // Theo dõi thay đổi trong giỏ hàng
    this.cartService.getCartItemsObservable().subscribe((cartItems: Product[]) => {
      this.cartItemCount = cartItems.length;
    });

    // Theo dõi thay đổi trong wishlist
    this.wishlistService.getWishList().subscribe((wishlistItems: Product[]) => {
      this.wishlistItemCount = wishlistItems.length;
    });
    this.wishlistItemCount = this.wishlistService.getWishListCount();
  }

  ngOnInit(): void {
    // Theo dõi trạng thái đăng nhập từ AuthService
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  // Phương thức logout
  logout(): void {
    this.authService.logout().subscribe(() => {
    });
  }

  toggleSidebar(){
    this.isSidebarVisible = !this.isSidebarVisible
  }
closeSidebar(){
  this.isSidebarVisible = false
}


}