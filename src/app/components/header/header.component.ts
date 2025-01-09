import { Component, OnInit, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../cart.service';
import { Product } from '../../type/Products';

@Component({
  selector: 'app-header',
  standalone: true,  // Đảm bảo component này là standalone
  imports: [CommonModule],  // Thêm CommonModule vào imports
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartItemCount: number =0;
  isLoggedIn: boolean = false;
  isSidebarVisible = false;

  constructor(private authService: AuthService, private router: Router, private cartService: CartService) {

    this.cartItemCount = this.cartService.getCartItemCount();

    // Theo dõi thay đổi trong giỏ hàng
    this.cartService.getCartItemsObservable().subscribe((cartItems: Product[]) => {
      this.cartItemCount = cartItems.length;
    });
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
// header.component.ts
checkLoginBeforeNavigate(route: string, event: Event): void {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
  if (!this.isLoggedIn) {
    alert('Vui lòng đăng nhập để truy cập trang này.');
    this.router.navigate(['/login']);
  } else {
    this.router.navigate([route]);
  }
}
}