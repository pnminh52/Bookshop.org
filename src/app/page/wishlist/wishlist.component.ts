import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../wishlist.service';
import { Product } from '../../type/Products';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  userId: string | null = null;
  wishlist: Product[] = [];

  constructor(private wishlistService: WishlistService) {}
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    console.log('User  ID:', this.userId); // Thêm dòng này để kiểm tra giá trị userId
    this.loadWishlist();
  }
  loadUserIdAndWishlist(): void {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.loadWishlist();
    } else {
      this.wishlist = []; // Nếu không có userId, xóa wishlist
    }
  }
  loadWishlist(): void {
    if (this.userId) {
      this.wishlistService.getWishlist(this.userId).subscribe({
        next: (data: any) => {
          // Lọc ra các sản phẩm từ wishlist
          this.wishlist = data.map((item: any) => item.product);
        },
        error: (err) => {
          console.error('Error loading wishlist:', err);
        }
      });
    }

  }}