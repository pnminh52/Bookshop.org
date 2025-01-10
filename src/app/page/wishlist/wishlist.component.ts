// wishlist.component.ts
import { Component, OnInit } from '@angular/core';
import { WishListService } from '../../wishlist.service';
import { Product } from '../../type/Products';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  templateUrl: './wishlist.component.html',
  imports: [CommonModule],
  styleUrls: ['./wishlist.component.css']
})
export class WishListComponent implements OnInit {
  wishList: Product[] = [];

  constructor(private wishListService: WishListService) {
  }

  ngOnInit(): void {
    // Subscribe để nhận dữ liệu từ BehaviorSubject
    this.wishListService.getWishList().subscribe((wishList) => {
      this.wishList = wishList;
    });
  }

  // Xóa sản phẩm khỏi Wishlist
  removeProductFromWishList(product: Product): void {
    this.wishListService.removeProductFromWishList(product);
  }
}