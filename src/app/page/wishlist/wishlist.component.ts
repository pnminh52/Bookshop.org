import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../wishlist.service';
import { Product } from '../../type/Products';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  userId: string | null = null;
  wishlist: Product[] = [];
  successMessage: string | null = null; 
  alertMessage: string | null = null;

  constructor(private wishlistService: WishlistService, private router: Router) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    if (!this.userId) {
      this.router.navigate(['/login']);
    } else {
      console.log('User ID:', this.userId);
      this.loadWishlist();
    }
  }

  loadWishlist(): void {
    if (this.userId) {
      this.wishlistService.getWishlist(this.userId).subscribe({
        next: (data: any) => {
          console.log('Raw Data:', data);
          
          if (data && Array.isArray(data)) {
            this.wishlist = data;
          } else {
          }
        }
      });
    }
  }

  removeFromWishlist(productId: string): void {
    if (this.userId) {
      this.wishlistService.removeFromWishlist(this.userId, productId).subscribe({
        next: () => {
          this.wishlist = this.wishlist.filter(product => product.id !== productId);
          this.successMessage = 'Product removed from wishlist successfully!';
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (err) => {
          console.error('Lỗi khi xóa sản phẩm khỏi wishlist:', err);
        }
      });
    }
  }
}
